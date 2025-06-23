'use client';

import YouTube, { YouTubeProps } from 'react-youtube';

interface VideoPlayerProps {
  videoId: string;
  onTimeUpdate: (seconds: number) => void;
}

export default function VideoPlayer({ videoId, onTimeUpdate }: VideoPlayerProps) {
  let playerRef: any = null;
  let intervalId: NodeJS.Timeout | null = null;

  const opts: YouTubeProps['opts'] = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 0,
      modestbranding: 1,
      rel: 0,
    },
  };

  const onReady: YouTubeProps['onReady'] = (event) => {
    playerRef = event.target;
  };

  const onStateChange: YouTubeProps['onStateChange'] = (event) => {
    if (event.data === 1) { // Playing
      if (intervalId) clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (playerRef) {
          const currentTime = playerRef.getCurrentTime();
          onTimeUpdate(currentTime);
        }
      }, 100); // Check every 100ms for smooth updates
    } else {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    }
  };

  return (
    <div className="w-full h-full bg-black rounded-lg overflow-hidden">
      <YouTube
        videoId={videoId}
        opts={opts}
        onReady={onReady}
        onStateChange={onStateChange}
        className="w-full h-full"
        iframeClassName="w-full h-full"
      />
    </div>
  );
}