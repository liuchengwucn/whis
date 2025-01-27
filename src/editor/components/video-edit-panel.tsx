import { Textarea } from "@fluentui/react-components";
import VideoPlayer from "./video-player";
import { useEditorStore } from "../../lib/store";

function VideoEditPanel() {
  const currentLine = useEditorStore((state) => state.currentLine);
  const updateLine = useEditorStore((state) => state.updateLine);
  const currentLineText =
    useEditorStore((state) => state.lines()[currentLine!]?.Text?.raw) ?? "";
  const nextLine = useEditorStore((state) => state.nextLine);

  return (
    <div className="flex gap-4 p-4">
      <VideoPlayer />
      <Textarea
        placeholder="Enter your subtitle!"
        className="grow"
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
      />
    </div>
  );
}

export default VideoEditPanel;
