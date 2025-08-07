"use client";

import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";

interface VimeoPlayerProps {
  videoId: string;
  title?: string;
  autoplay?: boolean;
  width?: number;
  height?: number;
  className?: string;
  lazy?: boolean;
}

export default function VimeoPlayer({
  videoId,
  title = "Video Lesson",
  autoplay = false,
  width = 640,
  height = 360,
  className = "",
  lazy = true,
}: VimeoPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(!lazy);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!lazy) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoaded) {
          setIsInView(true);
          setIsLoaded(true);
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '100px'
      }
    );

    const currentContainer = containerRef.current;
    if (currentContainer) {
      observer.observe(currentContainer);
    }

    return () => {
      if (currentContainer) {
        observer.unobserve(currentContainer);
      }
    };
  }, [lazy, isLoaded]);

  const vimeoSrc = `https://player.vimeo.com/video/${videoId}?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=${autoplay ? 1 : 0}`;

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <div 
        className="relative w-full"
        style={{ paddingBottom: `${(height / width) * 100}%` }}
      >
        {isLoaded ? (
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
            loading={lazy ? "lazy" : undefined}
          />
        ) : (
          <div className="absolute top-0 left-0 w-full h-full bg-gray-900 rounded-lg flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="w-8 h-8 text-white" />
              </div>
              <p className="text-sm opacity-75">Click to load video</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}