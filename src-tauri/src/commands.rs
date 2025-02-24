use mutter::Model;
use rig::{completion::Prompt, providers::openai};
use serde_json::Value;
use tauri::{path::BaseDirectory, Manager};
use tauri_plugin_store::StoreExt;

#[tauri::command]
pub async fn query_llm(handle: tauri::AppHandle, value: String) -> Result<String, String> {
    let store = handle.store("store.json").map_err(|e| e.to_string())?;

    let base_url = store.get("base-url").unwrap_or("".into());
    let Value::String(mut base_url) = base_url else {
        unreachable!()
    };
    if base_url.is_empty() {
        base_url = "https://api.openai.com/v1".into();
    }

    let api_key = store.get("api-key").unwrap_or("".into());
    let Value::String(api_key) = api_key else {
        unreachable!()
    };

    let model_name = store.get("model-name").unwrap_or("gpt-4o-mini".into());
    let Value::String(mut model_name) = model_name else {
        unreachable!()
    };
    if model_name.is_empty() {
        model_name = "gpt-4o-mini".into();
    }

    let openai_client = openai::Client::from_url(&api_key, &base_url);
    let model = openai_client.agent(&model_name).build();

    let response = model
        .prompt(value.as_str())
        .await
        .map_err(|e| e.to_string())?;

    Ok(response)
}

#[tauri::command]
pub async fn query_whisper(
    handle: tauri::AppHandle,
    path_to_media: String,
) -> Result<String, String> {
    let store = handle.store("store.json").map_err(|e| e.to_string())?;
    let language = store.get("source-language").unwrap_or("".into());
    let Value::String(language) = language else {
        unreachable!()
    };

    let path_to_model = handle
        .path()
        .resolve(
            "models/ggml-large-v3-turbo-q5_0.bin",
            BaseDirectory::Resource,
        )
        .map_err(|e| e.to_string())?;

    let model = Model::new(path_to_model.to_str().unwrap()).map_err(|e| e.to_string())?;
    let media = std::fs::read(path_to_media).map_err(|e| e.to_string())?;

    let translate = false;
    let individual_word_timestamps = false;
    let threads = None;
    let transcription = model
        .transcribe_audio(
            media,
            translate,
            individual_word_timestamps,
            threads,
            Option::from(language.as_str()),
        )
        .unwrap();

    Ok(transcription.as_text())
}
