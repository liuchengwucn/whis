import { convertFileSrc } from "@tauri-apps/api/core";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { ParsedASS, ParsedASSEvent } from "ass-compiler";
import { queryTranslation, transcribeCurrentLine } from "./ai-utils";

interface LineCache {
  transcription?: string;
  translation?: string;
}

interface FilePathStore {
  videoPath: string;
  subtitlePath: string;
  updateVideoPath: (newPath: string) => void;
  updateSubtitlePath: (newPath: string) => void;
}

export const useFilePathStore = create<FilePathStore>((set) => ({
  videoPath: "",
  subtitlePath: "",
  updateVideoPath: (newPath) => set({ videoPath: newPath }),
  updateSubtitlePath: (newPath) => set({ subtitlePath: newPath }),
}));

export function useVideoUrl() {
  const videoPath = useFilePathStore((state) => state.videoPath);
  if (videoPath) {
    return convertFileSrc(videoPath);
  } else {
    return "";
  }
}

export function useSubtitleUrl() {
  const subtitlePath = useFilePathStore((state) => state.subtitlePath);
  if (subtitlePath) {
    return convertFileSrc(subtitlePath);
  } else {
    return "";
  }
}

interface EditorState {
  parsedAss: ParsedASS | undefined;
  currentLine: number | undefined;
  transcription: string;
  translation: string;
  lineCache: Record<number, LineCache>;
  playTrigger: number; // Used to trigger replay of the same line
  lines: () => ParsedASSEvent[];
  updateLine: (lineNumber: number, text: string) => void;
  nextLine: () => void;
  setCurrentLineWithCache: (lineNumber: number) => void;
  playCurrentLine: () => void; // New method to replay current line
  currentLineStart: () => number | undefined;
  currentLineEnd: () => number | undefined;
  getCachedTranscription: (lineNumber: number) => string | undefined;
  getCachedTranslation: (lineNumber: number) => string | undefined;
  setCachedTranscription: (lineNumber: number, transcription: string) => void;
  setCachedTranslation: (lineNumber: number, translation: string) => void;
  hasLineCache: (lineNumber: number) => boolean;
}

export const useEditorStore = create<EditorState>()(
  subscribeWithSelector((set, get) => ({
    parsedAss: undefined,
    lines: () => {
      return get().parsedAss?.events.dialogue ?? [];
    },
    currentLine: undefined,
    transcription: "",
    translation: "",
    lineCache: {},
    playTrigger: 0,

    getCachedTranscription: (lineNumber: number) => {
      return get().lineCache[lineNumber]?.transcription;
    },

    getCachedTranslation: (lineNumber: number) => {
      return get().lineCache[lineNumber]?.translation;
    },

    setCachedTranscription: (lineNumber: number, transcription: string) => {
      set((state) => ({
        ...state,
        lineCache: {
          ...state.lineCache,
          [lineNumber]: {
            ...state.lineCache[lineNumber],
            transcription,
          },
        },
      }));
    },

    setCachedTranslation: (lineNumber: number, translation: string) => {
      set((state) => ({
        ...state,
        lineCache: {
          ...state.lineCache,
          [lineNumber]: {
            ...state.lineCache[lineNumber],
            translation,
          },
        },
      }));
    },

    hasLineCache: (lineNumber: number) => {
      const cache = get().lineCache[lineNumber];
      return !!(cache?.transcription && cache?.translation);
    },

    currentLineStart: () => {
      const currentLine = get().currentLine;
      if (currentLine === undefined) return undefined;
      return get().lines()[currentLine].Start;
    },

    currentLineEnd: () => {
      const currentLine = get().currentLine;
      if (currentLine === undefined) return undefined;
      return get().lines()[currentLine].End;
    },

    updateLine: (lineIndex, text) =>
      set((state) => {
        if (!state.parsedAss) return state;
        return {
          ...state,
          parsedAss: {
            ...state.parsedAss,
            events: {
              ...state.parsedAss.events,
              dialogue: state.parsedAss.events.dialogue.map((line, index) =>
                index === lineIndex
                  ? {
                      ...line,
                      Text: {
                        raw: text,
                        combined: text,
                        parsed: [
                          {
                            tags: [],
                            text,
                            drawing: [],
                          },
                        ],
                      },
                    }
                  : line,
              ),
            },
          },
        };
      }),

    setCurrentLineWithCache: async (lineNumber: number) => {
      set({
        currentLine: lineNumber,
      });

      // Check if we have cached data for this line
      const cachedTranscription = get().getCachedTranscription(lineNumber);
      if (cachedTranscription) {
        set({ transcription: cachedTranscription });
      } else {
        set({ transcription: "" });
      }

      const cachedTranslation = get().getCachedTranslation(lineNumber);

      if (cachedTranslation) {
        set({
          translation: cachedTranslation,
        });
      } else {
        set({
          translation: "",
        });
      }

      // If no cache, trigger AI operations
      if (!cachedTranscription) {
        await transcribeCurrentLine();
      }
      if (!cachedTranslation) {
        await queryTranslation();
      }
    },

    nextLine: () => {
      const state = get();
      if (typeof state.currentLine === "undefined") return;
      if (state.currentLine >= state.lines().length - 1) {
        return;
      }
      const nextLineNumber = state.currentLine + 1;
      get().setCurrentLineWithCache(nextLineNumber);
    },

    playCurrentLine: () => {
      set((state) => ({
        playTrigger: state.playTrigger + 1,
      }));
    },
  })),
);
