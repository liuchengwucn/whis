use ffmpeg_next as ffmpeg;
use std::sync::Arc;
use std::sync::Mutex;
use whisper_rs::{FullParams, SamplingStrategy, WhisperContext, WhisperContextParameters};

// Global whisper context cache using Mutex for thread safety
lazy_static::lazy_static! {
    static ref CACHED_CONTEXT: Mutex<Option<(Arc<WhisperContext>, String, bool)>> = Mutex::new(None);
}

/// Get or create a cached Whisper context
/// Returns a new context, but caches the model parameters to avoid redundant model loading
pub fn get_whisper_context(
    model_path: &str,
    use_gpu: bool,
) -> Result<Arc<WhisperContext>, Box<dyn std::error::Error>> {
    let mut cache = CACHED_CONTEXT.lock().unwrap();

    // Check if we have a cached instance with the same parameters
    if let Some((ref context, ref cached_path, cached_gpu)) = *cache {
        if cached_path == model_path && cached_gpu == use_gpu {
            return Ok(Arc::clone(context));
        }
    }

    // Create new context with specified parameters
    let mut params = WhisperContextParameters::default();
    params.use_gpu = use_gpu;

    let context = Arc::new(WhisperContext::new_with_params(model_path, params)?);

    // Update cache
    *cache = Some((Arc::clone(&context), model_path.to_string(), use_gpu));

    Ok(context)
}

/// Returns 32-bit float, 16kHz, mono PCM data suitable for Whisper
pub fn extract_audio_segment(
    video_path: &str,
    start_time: f64,
    end_time: f64,
) -> Result<Vec<f32>, Box<dyn std::error::Error>> {
    ffmpeg::init()?;

    let mut ictx = ffmpeg::format::input(&video_path)?;

    let input = ictx
        .streams()
        .best(ffmpeg::media::Type::Audio)
        .ok_or("No audio stream found")?;
    let input_index = input.index();

    // Get time base for accurate timestamp calculations
    let time_base = input.time_base();

    // Get codec context to access sample rate
    let context_decoder = ffmpeg::codec::context::Context::from_parameters(input.parameters())?;
    let decoder_info = context_decoder.decoder().audio()?;
    let original_sample_rate = decoder_info.rate() as f64;

    // Seek to a point slightly before start_time to ensure accuracy
    let seek_margin = 0.5; // 0.5 seconds margin
    let seek_time = (start_time - seek_margin).max(0.0);
    let seek_timestamp = (seek_time / (time_base.0 as f64 / time_base.1 as f64)) as i64;

    ictx.seek(seek_timestamp, ..)?;

    let mut decoder = decoder_info;

    // Set up resampler for converting to 16kHz mono f32
    let mut resampler = ffmpeg::software::resampling::context::Context::get(
        decoder.format(),
        decoder.channel_layout(),
        decoder.rate(),
        ffmpeg::format::Sample::F32(ffmpeg::format::sample::Type::Packed),
        ffmpeg::channel_layout::ChannelLayout::MONO,
        16000,
    )?;

    let duration = end_time - start_time;
    let target_samples = (16000.0 * duration) as usize;
    let mut pcm_data = Vec::with_capacity(target_samples);

    let mut decoded = ffmpeg::frame::Audio::empty();
    let mut current_time = 0.0;
    let mut started_collecting = false;

    'outer: for (stream, packet) in ictx.packets() {
        if stream.index() == input_index {
            decoder.send_packet(&packet)?;

            while decoder.receive_frame(&mut decoded).is_ok() {
                // Calculate the actual timestamp of this frame
                let pts = decoded.pts().unwrap_or(0) as f64;
                let frame_time = pts * (time_base.0 as f64 / time_base.1 as f64);

                // Calculate frame duration
                let frame_samples = decoded.samples();
                let frame_duration = frame_samples as f64 / original_sample_rate;

                // Check if this frame overlaps with our target time range
                let frame_end_time = frame_time + frame_duration;

                if frame_end_time < start_time {
                    // Frame is completely before our start time, skip it
                    continue;
                }

                if frame_time > end_time {
                    // Frame is completely after our end time, stop processing
                    break 'outer;
                }

                let mut resampled = ffmpeg::frame::Audio::empty();
                resampler.run(&decoded, &mut resampled)?;

                let plane_data = resampled.plane::<f32>(0);
                let resampled_samples = plane_data.len();
                let resampled_duration = resampled_samples as f64 / 16000.0;

                if !started_collecting && frame_time <= start_time && frame_end_time > start_time {
                    // This frame contains our start time
                    started_collecting = true;

                    // Calculate how much of this frame to skip
                    let skip_time = start_time - frame_time;
                    let skip_samples = (skip_time * 16000.0) as usize;

                    if skip_samples < resampled_samples {
                        let remaining_data = &plane_data[skip_samples..];
                        pcm_data.extend_from_slice(remaining_data);
                        current_time = start_time + remaining_data.len() as f64 / 16000.0;
                    }
                } else if started_collecting {
                    // Calculate how much of this frame to include
                    let remaining_duration = end_time - current_time;

                    if remaining_duration <= resampled_duration {
                        // This frame extends beyond our end time
                        let samples_to_take = (remaining_duration * 16000.0) as usize;
                        if samples_to_take > 0 && samples_to_take <= resampled_samples {
                            pcm_data.extend_from_slice(&plane_data[..samples_to_take]);
                        }
                        break 'outer;
                    } else {
                        // Include the entire frame
                        pcm_data.extend_from_slice(plane_data);
                        current_time += resampled_duration;
                    }
                }

                // Safety check to prevent infinite loops
                if pcm_data.len() >= target_samples * 2 {
                    break 'outer;
                }
            }
        }
    }

    // Ensure we have the exact number of samples requested
    pcm_data.truncate(target_samples);

    // If we don't have enough samples, pad with silence
    while pcm_data.len() < target_samples {
        pcm_data.push(0.0);
    }

    Ok(pcm_data)
}

/// Transcribe audio data using a provided Whisper context
/// Expects 32-bit float, 16kHz, mono PCM audio data
pub fn transcribe_audio(
    ctx: Arc<WhisperContext>,
    audio_data: &[f32],
    language: &str,
) -> Result<String, Box<dyn std::error::Error>> {
    // Set up parameters for transcription
    let mut params = FullParams::new(SamplingStrategy::Greedy { best_of: 1 });
    if language != "auto" && !language.is_empty() {
        params.set_language(Some(language));
    }
    params.set_print_special(false);
    params.set_print_progress(false);
    params.set_print_realtime(false);
    params.set_token_timestamps(true);

    // Create state for this inference
    let mut state = ctx.create_state()?;

    // Run inference
    state.full(params, audio_data)?;

    // Get number of segments
    let num_segments = state.full_n_segments()?;

    // Collect all segments text
    let mut result = String::new();
    for i in 0..num_segments {
        if let Ok(segment) = state.full_get_segment_text(i) {
            result.push_str(&segment);
            result.push(' ');
        }
    }

    Ok(result.trim().to_string())
}

/// Transcribe a segment of media file using a provided Whisper context
/// Extracts audio from the specified time range and transcribes it to text
pub fn transcribe_media(
    ctx: Arc<WhisperContext>,
    media_path: &str,
    from: f64,
    to: f64,
    language: &str,
) -> Result<String, Box<dyn std::error::Error>> {
    // Extract PCM audio data from the media file
    let audio_data = extract_audio_segment(media_path, from, to)?;

    // Transcribe the audio data using the provided context
    transcribe_audio(ctx, &audio_data, language)
}
