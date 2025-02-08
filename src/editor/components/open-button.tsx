import { open } from "@tauri-apps/plugin-dialog";
import { useEditorStore, useFilePathStore } from "../../lib/stores";
import {
  Button,
  Toast,
  ToastTitle,
  useToastController,
} from "@fluentui/react-components";
import { ComponentProps } from "react";
import { readTextFile } from "@tauri-apps/plugin-fs";
import { parse } from "ass-compiler";

export function OpenVideoButton({ ...props }: ComponentProps<typeof Button>) {
  const { dispatchToast } = useToastController();
  async function openVideo() {
    const updateVideoPath = useFilePathStore.getState().updateVideoPath;
    const result = await open({
      title: "Select a video file",
      filters: [{ name: "Video Files", extensions: ["mp4"] }],
    });
    if (!result) return;

    updateVideoPath(result);
    dispatchToast(
      <Toast>
        <ToastTitle>Video Opened Successfully</ToastTitle>
      </Toast>,
      { intent: "success" }
    );
  }

  return (
    <Button onClick={() => openVideo()} {...props}>
      Open Video
    </Button>
  );
}

export function OpenSubtitleButton({
  ...props
}: ComponentProps<typeof Button>) {
  const { dispatchToast } = useToastController();

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

    dispatchToast(
      <Toast>
        <ToastTitle>Subtitle Opened Successfully</ToastTitle>
      </Toast>,
      { intent: "success" }
    );
  }

  return (
    <Button onClick={() => openSubtitle()} {...props}>
      Open Subtitle
    </Button>
  );
}
