import { useEditorStore, useFilePathStore } from "./stores";
import { getGlossary, formatGlossaryForPrompt } from "./glossary-utils";
import { invoke } from "@tauri-apps/api/core";
import { load } from "@tauri-apps/plugin-store";

export const languages = ["en", "zh", "ja"];
export const languageDisplay = {
  en: "英文",
  zh: "简体中文",
  ja: "日文",
};
export const defaultPrompt =
  "请将以下{sourceLanguage}文本翻译成{targetLanguage}，保持原文的语调和意思。使用空格代替句号和逗号。只返回翻译结果，不要添加任何额外的说明。\n\n{glossary}\n\n{context}\n\n当前需要翻译的内容：\n{transcription}";

// Token to track the latest transcription request
let latestTranscriptionToken = 0;
// Token to track the latest translation request
let latestTranslationToken = 0;

/**
 * Gets context from previous subtitle lines (up to 5 lines)
 */
function getPreviousLinesContext(currentLine: number): string {
  const store = useEditorStore.getState();
  const lines = store.lines();

  if (currentLine <= 0 || lines.length === 0) {
    return "";
  }

  const contextLines: string[] = [];
  const maxContext = 5;
  const startIndex = Math.max(0, currentLine - maxContext);

  for (let i = startIndex; i < currentLine; i++) {
    const cachedTranscription = store.getCachedTranscription(i);

    // Get human translation from subtitle file (original text) first
    const humanTranslation = lines[i]?.Text?.raw;
    // Fallback to cached AI translation if no human translation exists
    const cachedTranslation = store.getCachedTranslation(i);

    // Use human translation if it exists and is not empty, otherwise use AI translation
    const translation =
      humanTranslation && humanTranslation.trim() !== ""
        ? humanTranslation
        : cachedTranslation;

    if (cachedTranscription) {
      contextLines.push(`原文：${cachedTranscription}`);
    }
    if (translation) {
      contextLines.push(`译文：${translation}`);
    }
    if (cachedTranscription || translation) {
      contextLines.push("---");
    }
  }

  if (contextLines.length === 0) {
    return "";
  }

  // Remove the last "---" separator
  contextLines.pop();

  return "前面几条字幕的上下文如下：\n" + contextLines.join("\n") + "\n";
}
/**
 * Transcribes audio from video file for the current line time range
 */
export async function transcribeCurrentLine(): Promise<string> {
  // Increment token to mark this as the latest request
  const currentToken = ++latestTranscriptionToken;

  const videoPath = useFilePathStore.getState().videoPath;
  const startTime = useEditorStore.getState().currentLineStart();
  const endTime = useEditorStore.getState().currentLineEnd();
  const currentLine = useEditorStore.getState().currentLine;

  if (
    !videoPath ||
    startTime === undefined ||
    endTime === undefined ||
    currentLine === undefined
  ) {
    throw new Error("Missing video path or time range for transcription");
  }

  const message = await invoke("query_whisper", {
    pathToMedia: videoPath,
    startTime,
    endTime,
  });

  // Only update state if this is still the latest request
  if (
    currentToken === latestTranscriptionToken &&
    currentLine === useEditorStore.getState().currentLine
  ) {
    useEditorStore.setState({ transcription: message as string });
  }
  useEditorStore
    .getState()
    .setCachedTranscription(currentLine, message as string);

  return message as string;
}

/**
 * Sends an AI query with the current transcription
 */
export async function queryTranslation(): Promise<string> {
  // Increment token to mark this as the latest request
  const currentToken = ++latestTranslationToken;

  const transcription = useEditorStore.getState().transcription;
  const currentLine = useEditorStore.getState().currentLine;

  if (!transcription) {
    throw new Error("No transcription available for AI query");
  }

  if (currentLine === undefined) {
    throw new Error("No current line selected for translation");
  }

  // Get source and target languages from config
  const store = await load("store.json");
  const sourceLanguage =
    ((await store.get("source-language")) as string) || "ja";
  const targetLanguage =
    ((await store.get("target-language")) as string) || "zh";

  // Get source and target language names
  const sourceLanguageName =
    languageDisplay[sourceLanguage as keyof typeof languageDisplay] ||
    sourceLanguage;
  const targetLanguageName =
    languageDisplay[targetLanguage as keyof typeof languageDisplay] ||
    targetLanguage;

  // Get glossary and format it for prompt
  const glossary = await getGlossary();
  const glossaryText = formatGlossaryForPrompt(glossary.items);

  // Get context from previous lines
  const contextText = getPreviousLinesContext(currentLine);

  // Get custom translation prompt or use default
  const customPrompt = await store.get("translation-prompt");
  let systemPrompt: string;

  if (customPrompt) {
    // Replace placeholders in custom prompt
    systemPrompt = (customPrompt as string)
      .replace(/{sourceLanguage}/g, sourceLanguageName)
      .replace(/{targetLanguage}/g, targetLanguageName)
      .replace(/{glossary}/g, glossaryText)
      .replace(/{context}/g, contextText)
      .replace(/{transcription}/g, transcription);
  } else {
    // Use default prompt
    systemPrompt = defaultPrompt
      .replace(/{sourceLanguage}/g, sourceLanguageName)
      .replace(/{targetLanguage}/g, targetLanguageName)
      .replace(/{glossary}/g, glossaryText)
      .replace(/{context}/g, contextText)
      .replace(/{transcription}/g, transcription);
  }

  const message: string = await invoke("query_llm", {
    prompt: systemPrompt,
  });

  // Only update state if this is still the latest request
  if (
    currentToken === latestTranslationToken &&
    currentLine === useEditorStore.getState().currentLine
  ) {
    useEditorStore.setState({ translation: message });
  }
  useEditorStore.getState().setCachedTranslation(currentLine, message);

  return message;
}

/**
 * Copies the current translation to the subtitle line
 */
export function copyTranslationToSubtitle(): void {
  const translation = useEditorStore.getState().translation;
  const currentLine = useEditorStore.getState().currentLine;
  if (!translation || !currentLine) {
    return;
  }
  const updateLine = useEditorStore.getState().updateLine;
  updateLine(currentLine, translation);
}
