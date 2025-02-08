import { Button } from "@fluentui/react-components";
import { stringify } from "ass-compiler";
import { ComponentProps } from "react";
import { useEditorStore, useFilePathStore } from "../../lib/stores";
import { writeTextFile } from "@tauri-apps/plugin-fs";

async function saveSubtitle() {
  const parsedAss = useEditorStore.getState().parsedAss;
  if (!parsedAss) return;
  const subtitlePath = useFilePathStore.getState().subtitlePath;

  const text = stringify(parsedAss);
  await writeTextFile(subtitlePath, text);
}

function SaveButton({ ...props }: ComponentProps<typeof Button>) {
  return (
    <Button onClick={() => saveSubtitle()} {...props}>
      Save
    </Button>
  );
}

export default SaveButton;
