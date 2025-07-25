import {
  Button,
  Toast,
  ToastTitle,
  useToastController,
} from "@fluentui/react-components";
import { stringify } from "ass-compiler";
import { ComponentProps } from "react";
import { useEditorStore, useFilePathStore } from "../../lib/stores";
import { writeTextFile } from "@tauri-apps/plugin-fs";

function SaveButton({ ...props }: ComponentProps<typeof Button>) {
  const { dispatchToast } = useToastController();

  async function saveSubtitle() {
    const parsedAss = useEditorStore.getState().parsedAss;
    if (!parsedAss) return;
    const subtitlePath = useFilePathStore.getState().subtitlePath;

    const text = stringify(parsedAss);
    await writeTextFile(subtitlePath, text);

    dispatchToast(
      <Toast>
        <ToastTitle>字幕保存成功！</ToastTitle>
      </Toast>,
      { intent: "success" },
    );
  }

  return (
    <Button onClick={() => saveSubtitle()} {...props}>
      保存
    </Button>
  );
}

export default SaveButton;
