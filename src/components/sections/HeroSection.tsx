import { HeroSectionData } from '@/types/section';
import { getVariant } from '@/lib/variants';
import { buildSectionStyle } from '@/lib/sectionStyle';

type Props = {
  data: HeroSectionData;
  styleOverrides?: Record<string, string>;
};

export default function HeroSection({ data, styleOverrides }: Props) {
  const variant = getVariant('hero', data as Record<string, unknown>);

  const sectionStyle = buildSectionStyle('var(--bg)', styleOverrides);

  const ctaButton = data.ctaText && (
    <a
      href={data.ctaUrl ?? '#'}
      className="inline-block font-semibold text-white transition-opacity duration-200 hover:opacity-90 cursor-pointer"
      style={{
        backgroundColor: 'var(--accent)',
        borderRadius: 'var(--button-radius)',
        boxShadow: 'var(--button-shadow)',
        padding: '0.875rem 2rem',
      }}
    >
      {data.ctaText}
    </a>
  );

  if (variant === 'fullscreen') {
    const fullscreenStyle = {
      background: 'linear-gradient(135deg, var(--accent) 0%, color-mix(in srgb, var(--accent) 55%, #000000) 100%)',
      color: '#ffffff',
      fontFamily: 'var(--font-body)',
      ...styleOverrides,
    };

    return (
      <section className="relative flex min-h-[80vh] items-center overflow-hidden md:min-h-screen" style={fullscreenStyle}>
        {/* 幾何学デコレーション */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
          <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full border border-white/10 bg-white/5" />
          <div className="absolute -right-4 top-1/4 h-64 w-64 rounded-full border border-white/10 bg-white/5" />
          <div className="absolute bottom-10 right-10 h-40 w-40 rounded-full border border-white/10 bg-white/5" />
          <div className="absolute right-1/4 top-1/2 h-24 w-24 rounded-full bg-white/5" />
          <div className="absolute bottom-1/3 right-1/3 h-16 w-16 rounded-full border border-white/10" />
        </div>

        <div className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-8 px-4 py-16 md:gap-12 md:px-6 md:py-24 md:grid-cols-2">
          {/* 左: テキスト */}
          <div>
            <h1
              className="text-3xl font-bold leading-tight md:text-5xl lg:text-6xl"
              style={{ fontFamily: 'var(--font-heading)', color: '#ffffff' }}
            >
              {data.headline}
            </h1>
            {data.subheadline && (
              <p className="mt-4 whitespace-pre-wrap text-base leading-relaxed md:mt-5 md:text-lg" style={{ color: '#ffffff', opacity: 0.8 }}>
                {data.subheadline}
              </p>
            )}
            {data.ctaText && (
              <div className="mt-6 md:mt-8">
                <a
                  href={data.ctaUrl ?? '#'}
                  className="inline-block font-semibold transition-opacity duration-200 hover:opacity-90 cursor-pointer"
                  style={{
                    backgroundColor: '#ffffff',
                    color: 'var(--accent)',
                    borderRadius: 'var(--button-radius)',
                    boxShadow: 'var(--button-shadow)',
                    padding: '0.875rem 2rem',
                  }}
                >
                  {data.ctaText}
                </a>
              </div>
            )}
          </div>

          {/* 右: サイド画像 or 装飾 */}
          <div className="flex items-center justify-center">
            {data.sideImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={data.sideImage}
                alt=""
                className="w-full max-w-md rounded-2xl object-cover shadow-2xl"
                style={{ borderRadius: 'var(--radius)' }}
              />
            ) : (
              <div className="relative flex h-48 w-48 items-center justify-center md:h-96 md:w-96">
                <div className="absolute inset-0 rounded-full bg-white/10" />
                <div className="absolute inset-4 rounded-full bg-white/10 md:inset-8" />
                <div className="absolute inset-8 rounded-full bg-white/10 md:inset-16" />
                <div className="h-16 w-16 rounded-full bg-white/20 md:h-24 md:w-24" />
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'split') {
    return (
      <section
        className="relative"
        style={sectionStyle}
      >
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-4 py-12 md:min-h-[70vh] md:gap-12 md:px-6 md:py-20 md:grid-cols-2">
          {/* 左: テキスト */}
          <div>
            <h1
              className="text-3xl font-bold leading-tight md:text-4xl lg:text-5xl"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {data.headline}
            </h1>
            {data.subheadline && (
              <p className="mt-4 whitespace-pre-wrap text-base leading-relaxed md:mt-5 md:text-lg" style={{ opacity: 0.75 }}>
                {data.subheadline}
              </p>
            )}
            {ctaButton && <div className="mt-6 md:mt-8">{ctaButton}</div>}
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
                className="flex h-48 w-full max-w-md items-center justify-center rounded-xl md:h-80"
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--accent) 12%, var(--bg))',
                  borderRadius: 'var(--radius)',
                }}
              >
                <svg className="h-12 w-12 opacity-30 md:h-16 md:w-16" viewBox="0 0 24 24" fill="currentColor">
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
      className="relative flex min-h-[60vh] flex-col items-center justify-center text-center md:min-h-[80vh]"
      style={sectionStyle}
    >
      {data.backgroundImage && (
        <img
          src={data.backgroundImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className="relative z-10 mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-0">
        <h1
          className="text-3xl font-bold leading-tight md:text-4xl lg:text-5xl"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {data.headline}
        </h1>
        {data.subheadline && (
          <p className="mt-4 whitespace-pre-wrap text-base leading-relaxed md:mt-5 md:text-xl" style={{ opacity: 0.75 }}>
            {data.subheadline}
          </p>
        )}
        {ctaButton && <div className="mt-6 md:mt-8">{ctaButton}</div>}
      </div>
    </section>
  );
}
