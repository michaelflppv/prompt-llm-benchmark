'use client';

import { useEffect, useRef } from 'react';

interface AutoplayVideoProps {
  src: string;
  poster?: string;
  className?: string;
  threshold?: number;
}

export function AutoplayVideo({
  src,
  poster,
  className = '',
  threshold = 0.75
}: AutoplayVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Video is fully visible, play it
            video.play().catch((error) => {
              console.log('Autoplay prevented:', error);
            });
          } else {
            // Video is not visible, pause it
            video.pause();
          }
        });
      },
      {
        threshold,
        rootMargin: '0px'
      }
    );

    observer.observe(video);

    return () => {
      if (video) {
        observer.unobserve(video);
      }
    };
  }, [threshold]);

  return (
    <video
      ref={videoRef}
      className={className}
      poster={poster}
      loop
      muted
      playsInline
      preload="metadata"
    >
      <source src={src} type="video/quicktime" />
      <source src={src} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}
