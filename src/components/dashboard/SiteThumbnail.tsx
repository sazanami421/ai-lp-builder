'use client';

import { useRef, useState, useEffect } from 'react';

export default function SiteThumbnail({ slug }: { slug: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    if (!ref.current) return;
    const update = () => {
      if (ref.current) setScale(ref.current.offsetWidth / 1280);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="h-full w-full overflow-hidden">
      {scale > 0 && (
        <iframe
          src={`/p/${slug}`}
          style={{
            width: '1280px',
            height: `${Math.ceil(112 / scale)}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            pointerEvents: 'none',
            border: 'none',
          }}
          scrolling="no"
          tabIndex={-1}
        />
      )}
    </div>
  );
}
