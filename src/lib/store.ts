import { convertFileSrc } from "@tauri-apps/api/core";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { ParsedASSEvent } from "ass-compiler";

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

// TODO: Add a comment field.
export interface LineState extends ParsedASSEvent {}

interface EditorState {
  lines: LineState[];
  updateLine: (lineNumber: number, text: string) => void;
}

export const useEditorStore = create<EditorState>()(
  subscribeWithSelector((set) => ({
    lines: [],

    updateLine: (lineIndex, text) =>
      set((state) => ({
        lines: state.lines.map((line, index) =>
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
      })),
  }))
);
