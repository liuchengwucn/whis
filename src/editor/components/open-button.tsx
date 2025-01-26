import { open } from "@tauri-apps/plugin-dialog";
import { useEditorStore, useFilePathStore } from "../../lib/store";
import { Button } from "@fluentui/react-components";
import { ComponentProps } from "react";
import { readTextFile } from "@tauri-apps/plugin-fs";
import { parse } from "ass-compiler";

export function OpenVideoButton({ ...props }: ComponentProps<typeof Button>) {
  const updateVideoPath = useFilePathStore((state) => state.updateVideoPath);

  const openVideo = async () => {
    const result = await open({
      title: "Select a video file",
      filters: [{ name: "Video Files", extensions: ["mp4"] }],
    });
    if (result) {
      updateVideoPath(result);
    }
  };

  return (
    <Button onClick={() => openVideo()} {...props}>
      Open Video
    </Button>
  );
}

export function OpenSubtitleButton({
  ...props
}: ComponentProps<typeof Button>) {
  const updateSubtitlePath = useFilePathStore(
    (state) => state.updateSubtitlePath
  );

  const openSubtitle = async () => {
    const result = await open({
      title: "Select a subtitle file",
      filters: [{ name: "Subtitle Files", extensions: ["ass"] }],
    });
    if (!result) return;

    updateSubtitlePath(result);
    const text = await readTextFile(result);
    const parsedAss = parse(text);
    // TODO: Append comments.
    useEditorStore.setState({ lines: parsedAss.events.dialogue });
    console.log(parsedAss);
  };

  return (
    <Button onClick={() => openSubtitle()} {...props}>
      Open Subtitle
    </Button>
  );
}
