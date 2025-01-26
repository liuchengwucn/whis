import { convertFileSrc } from "@tauri-apps/api/core";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { ParsedASS, ParsedASSEvent } from "ass-compiler";

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
  lines: () => ParsedASSEvent[];
  updateLine: (lineNumber: number, text: string) => void;
}

export const useEditorStore = create<EditorState>()(
  subscribeWithSelector((set, get) => ({
    parsedAss: undefined,
    lines: () => {
      return get().parsedAss?.events.dialogue ?? [];
    },
    currentLine: undefined,

    updateLine: (lineIndex, text) =>
      set((state) => ({
        ...state,
        parsedAss: {
          ...state.parsedAss!,
          events: {
            ...state.parsedAss!.events,
            dialogue: state.parsedAss!.events.dialogue.map((line, index) =>
              index === lineIndex
                ? {
                    ...line,
                    Text: {
                      ...line.Text,
                      raw: text,
                    },
                  }
                : line
            ),
          },
        },
      })),
  }))
);
