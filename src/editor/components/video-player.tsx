import { clsx } from "clsx";
import { useEffect, useRef } from "react";
import { useVideoUrl, useEditorStore } from "../../lib/stores";

function VideoPlayer() {
  const url = useVideoUrl();
  const videoRef = useRef<HTMLVideoElement>(null);
  const currentHandlerRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const playVideo = () => {
      if (videoRef.current) {
        // Remove any existing timeupdate listener
        if (currentHandlerRef.current) {
          videoRef.current.removeEventListener(
            "timeupdate",
            currentHandlerRef.current,
          );
          currentHandlerRef.current = null;
        }

        const startTime = useEditorStore.getState().currentLineStart();
        const endTime = useEditorStore.getState().currentLineEnd();
        if (startTime !== undefined && endTime !== undefined) {
          videoRef.current.currentTime = startTime;
          videoRef.current.play();

          // Create new timeupdate event listener for this line
          const handleTimeUpdate = () => {
            if (videoRef.current && videoRef.current.currentTime >= endTime) {
              videoRef.current.pause();
              videoRef.current.currentTime = startTime;
              if (currentHandlerRef.current) {
                videoRef.current.removeEventListener(
                  "timeupdate",
                  currentHandlerRef.current,
                );
                currentHandlerRef.current = null;
              }
            }
          };

          currentHandlerRef.current = handleTimeUpdate;
          videoRef.current.addEventListener("timeupdate", handleTimeUpdate);
        }
      }
    };

    // Subscribe to currentLine changes
    const unsubscribeCurrentLine = useEditorStore.subscribe(
      (state) => state.currentLine,
      (currentLine) => {
        if (currentLine !== undefined) {
          playVideo();
        }
      },
    );

    // Subscribe to playTrigger changes for replaying the same line
    const unsubscribePlayTrigger = useEditorStore.subscribe(
      (state) => state.playTrigger,
      () => {
        const currentLine = useEditorStore.getState().currentLine;
        if (currentLine !== undefined) {
          playVideo();
        }
      },
    );

    // Cleanup function
    return () => {
      unsubscribeCurrentLine();
      unsubscribePlayTrigger();
      if (videoRef.current && currentHandlerRef.current) {
        videoRef.current.removeEventListener(
          "timeupdate",
          currentHandlerRef.current,
        );
        currentHandlerRef.current = null;
      }
    };
  }, []);

  return (
    <video
      ref={videoRef}
      controls
      className={clsx({ hidden: !url }, "max-h-54 max-w-96")}
    >
      <source src={url} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}

export default VideoPlayer;
