import { HeroSectionData } from '@/types/section';
import { getVariant } from '@/lib/variants';

type Props = {
  data: HeroSectionData;
  styleOverrides?: Record<string, string>;
};

export default function HeroSection({ data, styleOverrides }: Props) {
  const variant = getVariant('hero', data as Record<string, unknown>);

  const sectionStyle = {
    backgroundColor: 'var(--bg)',
    backgroundImage: 'var(--texture)',
    color: 'var(--text)',
    fontFamily: 'var(--font-body)',
    ...styleOverrides,
  };

  const ctaButton = data.ctaText && (
    <a
      href={data.ctaUrl ?? '#'}
      className="inline-block font-semibold text-white transition-opacity duration-200 hover:opacity-90 cursor-pointer"
      style={{
        backgroundColor: 'var(--accent)',
        borderRadius: 'var(--radius)',
        padding: '0.875rem 2rem',
      }}
    >
      {data.ctaText}
    </a>
  );

  if (variant === 'split') {
    return (
      <section
        className="relative"
        style={sectionStyle}
      >
        <div className="mx-auto grid min-h-[70vh] max-w-6xl grid-cols-1 items-center gap-12 px-6 py-20 md:grid-cols-2">
          {/* 左: テキスト */}
          <div>
            <h1
              className="text-4xl font-bold leading-tight md:text-5xl"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {data.headline}
            </h1>
            {data.subheadline && (
              <p className="mt-5 text-lg leading-relaxed" style={{ opacity: 0.75 }}>
                {data.subheadline}
              </p>
            )}
            {ctaButton && <div className="mt-8">{ctaButton}</div>}
          </div>

          {/* 右: 画像 */}
          <div className="flex items-center justify-center">
            {data.sideImage || data.backgroundImage ? (
              <img
                src={data.sideImage ?? data.backgroundImage}
                alt=""
                className="w-full max-w-md rounded-xl object-cover shadow-lg"
                style={{ borderRadius: 'var(--radius)' }}
              />
            ) : (
              <div
                className="flex h-64 w-full max-w-md items-center justify-center rounded-xl md:h-80"
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--accent) 12%, var(--bg))',
                  borderRadius: 'var(--radius)',
                }}
              >
                <svg className="h-16 w-16 opacity-30" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                </svg>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  // centered (default)
  return (
    <section
      className="relative flex min-h-[80vh] flex-col items-center justify-center text-center"
      style={sectionStyle}
    >
      {data.backgroundImage && (
        <img
          src={data.backgroundImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className="relative z-10 mx-auto max-w-3xl px-6">
        <h1
          className="text-5xl font-bold leading-tight"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {data.headline}
        </h1>
        {data.subheadline && (
          <p className="mt-5 text-xl leading-relaxed" style={{ opacity: 0.75 }}>
            {data.subheadline}
          </p>
        )}
        {ctaButton && <div className="mt-8">{ctaButton}</div>}
      </div>
    </section>
  );
}
