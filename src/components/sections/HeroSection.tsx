import { HeroSectionData } from '@/types/section';
import { getVariant } from '@/lib/variants';

type Props = {
  data: HeroSectionData;
  styleOverrides?: Record<string, string>;
};

export default function HeroSection({ data, styleOverrides }: Props) {
  const variant = getVariant('hero', data as unknown as Record<string, unknown>);

  if (variant === 'split') {
    return <HeroSplit data={data} styleOverrides={styleOverrides} />;
  }
  return <HeroCentered data={data} styleOverrides={styleOverrides} />;
}

/** centered: テキスト・CTAを中央配置 */
function HeroCentered({ data, styleOverrides }: Props) {
  return (
    <section
      className="relative flex min-h-[80vh] flex-col items-center justify-center text-center"
      style={{
        backgroundColor: 'var(--bg)',
        color: 'var(--text)',
        fontFamily: 'var(--font-body)',
        backgroundImage: 'var(--texture)',
        ...styleOverrides,
      }}
    >
      {data.backgroundImage && (
        <img
          src={data.backgroundImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className="relative z-10 px-6">
        <h1
          className="text-5xl font-bold"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {data.headline}
        </h1>
        {data.subheadline && (
          <p className="mt-4 text-xl" style={{ opacity: 0.75 }}>
            {data.subheadline}
          </p>
        )}
        {data.ctaText && (
          <a
            href={data.ctaUrl ?? '#'}
            className="mt-8 inline-block font-semibold text-white"
            style={{
              backgroundColor: 'var(--accent)',
              borderRadius: 'var(--radius)',
              padding: '1rem 2rem',
            }}
          >
            {data.ctaText}
          </a>
        )}
      </div>
    </section>
  );
}

/** split: 左テキスト＋右画像の2カラム */
function HeroSplit({ data, styleOverrides }: Props) {
  return (
    <section
      className="flex min-h-[80vh] items-center"
      style={{
        backgroundColor: 'var(--bg)',
        color: 'var(--text)',
        fontFamily: 'var(--font-body)',
        backgroundImage: 'var(--texture)',
        ...styleOverrides,
      }}
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-6 md:grid-cols-2">
        {/* 左: テキスト */}
        <div>
          <h1
            className="text-5xl font-bold leading-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {data.headline}
          </h1>
          {data.subheadline && (
            <p className="mt-4 text-xl" style={{ opacity: 0.75 }}>
              {data.subheadline}
            </p>
          )}
          {data.ctaText && (
            <a
              href={data.ctaUrl ?? '#'}
              className="mt-8 inline-block font-semibold text-white"
              style={{
                backgroundColor: 'var(--accent)',
                borderRadius: 'var(--radius)',
                padding: '1rem 2rem',
              }}
            >
              {data.ctaText}
            </a>
          )}
        </div>
        {/* 右: 画像 */}
        <div className="flex justify-center">
          {(data.sideImage || data.backgroundImage) ? (
            <img
              src={data.sideImage || data.backgroundImage}
              alt=""
              className="max-h-[500px] w-full rounded-lg object-cover"
              style={{ borderRadius: 'var(--radius)' }}
            />
          ) : (
            <div
              className="flex h-80 w-full items-center justify-center text-sm"
              style={{
                backgroundColor: 'color-mix(in srgb, var(--bg) 90%, var(--text) 10%)',
                borderRadius: 'var(--radius)',
                opacity: 0.5,
              }}
            >
              画像を追加
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
