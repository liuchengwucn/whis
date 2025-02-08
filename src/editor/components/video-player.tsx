import clsx from "clsx";
import { useVideoUrl } from "../../lib/stores";

function VideoPlayer() {
  const url = useVideoUrl();

  return (
    <video controls className={clsx({ hidden: !url }, "max-h-54 max-w-96")}>
      <source src={url} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}

export default VideoPlayer;
