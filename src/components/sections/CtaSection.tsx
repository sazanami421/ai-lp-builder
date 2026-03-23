import { CtaSectionData } from '@/types/section';
import { getVariant } from '@/lib/variants';

type Props = {
  data: CtaSectionData;
  styleOverrides?: Record<string, string>;
};

export default function CtaSection({ data, styleOverrides }: Props) {
  const variant = getVariant('cta', data as unknown as Record<string, unknown>);

  if (variant === 'banner') {
    return <CtaBanner data={data} styleOverrides={styleOverrides} />;
  }
  return <CtaCentered data={data} styleOverrides={styleOverrides} />;
}

/** centered: 中央配置 */
function CtaCentered({ data, styleOverrides }: Props) {
  return (
    <section
      className="py-24 px-6 text-center"
      style={{
        backgroundColor: 'var(--bg)',
        color: 'var(--text)',
        fontFamily: 'var(--font-body)',
        backgroundImage: 'var(--texture)',
        ...styleOverrides,
      }}
    >
      <h2
        className="mb-4 text-4xl font-bold"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {data.headline}
      </h2>
      {data.subheadline && (
        <p className="mb-8 text-lg" style={{ opacity: 0.7 }}>
          {data.subheadline}
        </p>
      )}
      {data.ctaText && (
        <a
          href={data.ctaUrl ?? '#'}
          className="inline-block font-semibold text-white"
          style={{
            backgroundColor: 'var(--accent)',
            borderRadius: 'var(--radius)',
            padding: '1rem 2.5rem',
          }}
        >
          {data.ctaText}
        </a>
      )}
    </section>
  );
}

/** banner: 横長バナー形式（アクセントカラー背景） */
function CtaBanner({ data, styleOverrides }: Props) {
  return (
    <section
      className="py-12 px-6"
      style={{
        backgroundColor: 'var(--bg)',
        color: 'var(--text)',
        fontFamily: 'var(--font-body)',
        backgroundImage: 'var(--texture)',
        ...styleOverrides,
      }}
    >
      <div
        className="mx-auto flex max-w-5xl items-center justify-between gap-8 px-10 py-8"
        style={{
          backgroundColor: 'var(--accent)',
          borderRadius: 'var(--radius)',
        }}
      >
        <div className="text-white">
          <h2
            className="text-2xl font-bold"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {data.headline}
          </h2>
          {data.subheadline && (
            <p className="mt-1 text-sm" style={{ opacity: 0.85 }}>
              {data.subheadline}
            </p>
          )}
        </div>
        {data.ctaText && (
          <a
            href={data.ctaUrl ?? '#'}
            className="shrink-0 font-semibold transition"
            style={{
              backgroundColor: 'var(--bg)',
              color: 'var(--accent)',
              borderRadius: 'var(--radius)',
              padding: '0.75rem 2rem',
            }}
          >
            {data.ctaText}
          </a>
        )}
      </div>
    </section>
  );
}
