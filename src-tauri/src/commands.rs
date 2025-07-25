use async_openai::{
    types::{
        ChatCompletionRequestSystemMessageArgs, ChatCompletionRequestUserMessageArgs,
        CreateChatCompletionRequestArgs,
    },
    Client,
};
use mutter::Model;
use serde_json::Value;
use tauri_plugin_store::StoreExt;

#[tauri::command]
pub async fn query_llm(handle: tauri::AppHandle, prompt: String) -> Result<String, String> {
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

    let config = async_openai::config::OpenAIConfig::new()
        .with_api_key(api_key)
        .with_api_base(base_url);
    let client = Client::with_config(config);

    let request = CreateChatCompletionRequestArgs::default()
        .model(&model_name)
        .messages([
            ChatCompletionRequestSystemMessageArgs::default()
                .content("You are a helpful assistant.")
                .build()
                .map_err(|e| e.to_string())?
                .into(),
            ChatCompletionRequestUserMessageArgs::default()
                .content(prompt)
                .build()
                .map_err(|e| e.to_string())?
                .into(),
        ])
        .build()
        .map_err(|e| e.to_string())?;

    let response = client
        .chat()
        .create(request)
        .await
        .map_err(|e| e.to_string())?;

    let content = response
        .choices
        .first()
        .and_then(|choice| choice.message.content.as_ref())
        .ok_or("No response content")?;

    Ok(content.to_string())
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

    let model_path = store.get("whisper-model-path").unwrap_or("".into());
    let Value::String(model_path) = model_path else {
        unreachable!()
    };

    let model = Model::new(&model_path).map_err(|e| e.to_string())?;
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
