'use client';

import { LogoBarSectionData } from '@/types/section';
import { getVariant } from '@/lib/variants';

type Props = {
  data: LogoBarSectionData;
  styleOverrides?: Record<string, string>;
};

function LogoItem({ imageUrl, alt, url }: { imageUrl: string; alt: string; url?: string }) {
  const inner = imageUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imageUrl}
      alt={alt}
      className="h-8 w-auto max-w-[120px] object-contain grayscale transition duration-300 hover:grayscale-0"
      style={{ opacity: 0.6 }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.6')}
    />
  ) : (
    <div
      className="flex h-8 min-w-[80px] items-center justify-center rounded px-3 text-xs font-medium"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--text) 8%, transparent)',
        opacity: 0.5,
      }}
    >
      {alt}
    </div>
  );

  if (url) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center">
        {inner}
      </a>
    );
  }
  return <div className="flex items-center">{inner}</div>;
}

export default function LogoBarSection({ data, styleOverrides }: Props) {
  const variant = getVariant('logo_bar', data as Record<string, unknown>);

  const sectionStyle = {
    backgroundColor: 'var(--bg)',
    backgroundImage: 'var(--texture)',
    color: 'var(--text)',
    fontFamily: 'var(--font-body)',
    ...styleOverrides,
  };

  return (
    <section className="py-8 px-4 md:py-12 md:px-6" style={sectionStyle}>
      {data.title && (
        <p
          className="mb-6 text-center text-sm font-medium"
          style={{ opacity: 0.5 }}
        >
          {data.title}
        </p>
      )}

      {variant === 'scroll' ? (
        /* 無限横スクロール */
        <div className="overflow-hidden">
          <style>{`
            @keyframes logo-scroll {
              0%   { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
          `}</style>
          <div
            className="flex w-max gap-12"
            style={{ animation: 'logo-scroll 20s linear infinite' }}
          >
            {/* 2回繰り返して途切れなくする */}
            {[...data.items, ...data.items].map((item, i) => (
              <LogoItem key={i} {...item} />
            ))}
          </div>
        </div>
      ) : (
        /* static */
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {data.items.map((item, i) => (
            <LogoItem key={i} {...item} />
          ))}
        </div>
      )}
    </section>
  );
}
