'use client';

import { useEffect, useRef } from 'react';

interface YouTubeAutoplayVideoProps {
  videoId: string;
  className?: string;
  threshold?: number;
}

export default function YouTubeAutoplayVideo({
  videoId,
  className = '',
  threshold = 0.75,
}: YouTubeAutoplayVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // IntersectionObserver for viewport-based autoplay
  useEffect(() => {
    if (!containerRef.current || !iframeRef.current) return;

    const iframe = iframeRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!iframe.contentWindow) return;

        if (entry.isIntersecting) {
          // Play video
          iframe.contentWindow.postMessage(
            '{"event":"command","func":"playVideo","args":""}',
            '*'
          );
        } else {
          // Pause video
          iframe.contentWindow.postMessage(
            '{"event":"command","func":"pauseVideo","args":""}',
            '*'
          );
        }
      },
      { threshold }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div ref={containerRef} className={`youtube-video-container ${className}`}>
      <iframe
        ref={iframeRef}
        src={`https://www.youtube.com/embed/${videoId}?autoplay=0&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0&enablejsapi=1`}
        title="Demo Video"
        allow="autoplay; encrypted-media"
        allowFullScreen
      />
    </div>
  );
}
