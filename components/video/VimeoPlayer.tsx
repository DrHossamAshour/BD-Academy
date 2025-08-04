"use client";

import { useEffect, useRef } from "react";

interface VimeoPlayerProps {
  videoId: string;
  title?: string;
  autoplay?: boolean;
  width?: number;
  height?: number;
  className?: string;
}

export default function VimeoPlayer({
  videoId,
  title = "Video Lesson",
  autoplay = false,
  width = 640,
  height = 360,
  className = "",
}: VimeoPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const vimeoSrc = `https://player.vimeo.com/video/${videoId}?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=${autoplay ? 1 : 0}`;

  return (
    <div className={`relative w-full ${className}`}>
      <div 
        className="relative w-full"
        style={{ paddingBottom: `${(height / width) * 100}%` }}
      >
        <iframe
          ref={iframeRef}
          src={vimeoSrc}
          width={width}
          height={height}
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title={title}
          className="absolute top-0 left-0 w-full h-full rounded-lg"
        />
      </div>
    </div>
  );
}