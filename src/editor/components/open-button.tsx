import { open } from "@tauri-apps/plugin-dialog";
import { useEditorStore, useFilePathStore } from "../../lib/stores";
import { Button } from "@fluentui/react-components";
import { ComponentProps } from "react";
import { readTextFile } from "@tauri-apps/plugin-fs";
import { parse } from "ass-compiler";

async function openVideo() {
  const updateVideoPath = useFilePathStore.getState().updateVideoPath;
  const result = await open({
    title: "Select a video file",
    filters: [{ name: "Video Files", extensions: ["mp4"] }],
  });
  if (result) {
    updateVideoPath(result);
  }
}

export function OpenVideoButton({ ...props }: ComponentProps<typeof Button>) {
  return (
    <Button onClick={() => openVideo()} {...props}>
      Open Video
    </Button>
  );
}

async function openSubtitle() {
  const updateSubtitlePath = useFilePathStore.getState().updateSubtitlePath;

  const result = await open({
    title: "Select a subtitle file",
    filters: [{ name: "Subtitle Files", extensions: ["ass"] }],
  });
  if (!result) return;

  updateSubtitlePath(result);
  const text = await readTextFile(result);
  const parsedAss = parse(text);
  useEditorStore.setState({ parsedAss });
  if (parsedAss.events.dialogue.length !== 0) {
    useEditorStore.setState({
      currentLine: 0,
      transcription: "",
      translation: "",
    });
  }
}

export function OpenSubtitleButton({
  ...props
}: ComponentProps<typeof Button>) {
  return (
    <Button onClick={() => openSubtitle()} {...props}>
      Open Subtitle
    </Button>
  );
}
