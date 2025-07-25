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
      title: "请选择视频文件",
      filters: [{ name: "视频文件", extensions: ["mp4"] }],
    });
    if (!result) return;

    updateVideoPath(result);
    dispatchToast(
      <Toast>
        <ToastTitle>视频加载成功</ToastTitle>
      </Toast>,
      { intent: "success" },
    );
  }

  return (
    <Button onClick={() => openVideo()} {...props}>
      选择视频…
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
      title: "请选择字幕文件",
      filters: [{ name: "字幕文件", extensions: ["ass"] }],
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
        lineCache: {}, // Clear the line cache when loading a new subtitle file
      });
    }

    dispatchToast(
      <Toast>
        <ToastTitle>成功加载字幕</ToastTitle>
      </Toast>,
      { intent: "success" },
    );
  }

  return (
    <Button onClick={() => openSubtitle()} {...props}>
      选择字幕…
    </Button>
  );
}
