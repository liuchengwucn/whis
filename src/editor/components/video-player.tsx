import clsx from "clsx";
import { useVideoUrl } from "../../lib/store";

function VideoPlayer() {
  const url = useVideoUrl();

  return (
    <video controls className={clsx({ hidden: !url }, "max-h-36 max-w-64")}>
      <source src={url} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}

export default VideoPlayer;
