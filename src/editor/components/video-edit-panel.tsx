import { Input, Label } from "@fluentui/react-components";
import VideoPlayer from "./video-player";
import { useEditorStore } from "../../lib/stores";
import { CopyButton, MicButton, TransButton } from "./ai-buttons";

function VideoEditPanel() {
  const currentLine = useEditorStore((state) => state.currentLine);
  const updateLine = useEditorStore((state) => state.updateLine);
  const currentLineText =
    useEditorStore((state) => state.lines()[currentLine!]?.Text?.raw) ?? "";
  const nextLine = useEditorStore((state) => state.nextLine);

  const transcription = useEditorStore((state) => state.transcription);
  const translation = useEditorStore((state) => state.translation);

  return (
    <div className="flex gap-4">
      <VideoPlayer />
      <div className="flex flex-col gap-5 w-full">
        <Label className="flex flex-col gap-0.5">
          字幕
          <Input
            placeholder="请输入翻译字幕"
            value={currentLineText}
            onChange={(e) => {
              if (currentLine === undefined) return;
              updateLine(currentLine, e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (e.shiftKey) {
                  if (currentLine !== undefined) {
                    updateLine(currentLine, currentLineText + "\\N");
                  }
                } else {
                  nextLine();
                }
              }
            }}
            contentAfter={<MicButton />}
          />{" "}
        </Label>
        <div>
          <Label className="flex flex-col gap-0.5">
            AI转写
            <Input
              value={transcription}
              onChange={(e) => {
                useEditorStore.setState({ transcription: e.target.value });
              }}
              contentAfter={<TransButton />}
            />
          </Label>
        </div>
        <div>
          <Label className="flex flex-col gap-0.5">
            AI翻译
            <Input
              value={translation}
              onChange={(e) => {
                useEditorStore.setState({ translation: e.target.value });
              }}
              contentAfter={<CopyButton />}
            />
          </Label>
        </div>
      </div>
    </div>
  );
}

export default VideoEditPanel;
