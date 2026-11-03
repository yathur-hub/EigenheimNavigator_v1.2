import React, { useState } from 'react';

interface YouTubeFacadeProps {
  videoId: string;
  title: string;
  className?: string;
}

/**
 * Shows the YouTube thumbnail and loads the real player only after a click.
 * Saves roughly 1 MB of player JavaScript per embed on the first page load.
 */
const YouTubeFacade: React.FC<YouTubeFacadeProps> = ({ videoId, title, className = 'absolute inset-0 w-full h-full' }) => {
  const [active, setActive] = useState(false);

  if (active) {
    return (
      <iframe
        className={className}
        src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&autoplay=1`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        setActive(true);
        const w = window as any;
        if (Array.isArray(w.dataLayer)) w.dataLayer.push({ event: 'video_play', video_id: videoId, video_title: title });
      }}
      className={`${className} group/yt cursor-pointer bg-slate-900 p-0 border-0`}
      aria-label={`Video abspielen: ${title}`}
    >
      <img
        src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
        alt=""
        loading="lazy"
        decoding="async"
        width={480}
        height={360}
        className="w-full h-full object-cover opacity-95 group-hover/yt:opacity-100 transition-opacity"
      />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="w-16 h-11 rounded-xl bg-[#FF0000] flex items-center justify-center shadow-lg group-hover/yt:scale-110 transition-transform">
          <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path d="M6 4l10 6-10 6V4z" /></svg>
        </span>
      </span>
    </button>
  );
};

export default YouTubeFacade;
