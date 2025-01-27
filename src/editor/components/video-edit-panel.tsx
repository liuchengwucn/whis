import { Input, Label } from "@fluentui/react-components";
import VideoPlayer from "./video-player";
import { useEditorStore } from "../../lib/store";
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
    <div className="flex gap-4 p-4">
      <VideoPlayer />
      <div className="flex flex-col gap-5 w-full">
        <Label className="flex flex-col gap-0.5">
          Subtitle
          <Input
            placeholder="Enter your subtitle!"
            value={currentLineText}
            onChange={(e) => {
              if (currentLine === undefined) return;
              updateLine(currentLine, e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (e.shiftKey) {
                  updateLine(currentLine!, currentLineText + "\\N");
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
            AI Transcription
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
            AI Translation
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
