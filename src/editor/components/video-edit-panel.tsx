import { Textarea } from "@fluentui/react-components";
import VideoPlayer from "./video-player";

function VideoEditPanel() {
  return (
    <div className="flex gap-4 p-4">
      <VideoPlayer />
      <Textarea placeholder="Enter your subtitle!" className="grow" />
    </div>
  );
}

export default VideoEditPanel;
