'use client';

import { useState } from 'react';

interface YouTubeAutoplayVideoProps {
  videoId: string;
  className?: string;
  /** Accessible title for the embedded player. */
  title?: string;
}

/**
 * Click-to-load YouTube embed.
 *
 * Nothing is requested from YouTube / Google until the visitor explicitly
 * activates the player, so no IP address or cookies are shared on page load
 * (GDPR / TDDDG s.25). Once activated we use the privacy-enhanced
 * youtube-nocookie.com host and start playback.
 */
export default function YouTubeAutoplayVideo({
  videoId,
  className = '',
  title = 'Demo video'
}: YouTubeAutoplayVideoProps) {
  const [activated, setActivated] = useState(false);

  return (
    <div className={`youtube-video-container ${className}`}>
      {activated ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          style={{ border: 0, width: '100%', height: '100%' }}
        />
      ) : (
        <button
          type="button"
          className="youtube-facade"
          onClick={() => setActivated(true)}
        >
          <span className="youtube-facade-play" aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" focusable="false">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          <span className="youtube-facade-label">
            Load video
            <span className="youtube-facade-note">
              Connects to YouTube (Google) and may set cookies
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
