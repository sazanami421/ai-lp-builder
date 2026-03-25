import { CtaSectionData } from '@/types/section';
import { getVariant } from '@/lib/variants';

type Props = {
  data: CtaSectionData;
  styleOverrides?: Record<string, string>;
};

export default function CtaSection({ data, styleOverrides }: Props) {
  const variant = getVariant('cta', data as Record<string, unknown>);

  const sectionStyle = {
    backgroundColor: 'var(--bg)',
    backgroundImage: 'var(--texture)',
    color: 'var(--text)',
    fontFamily: 'var(--font-body)',
    ...styleOverrides,
  };

  if (variant === 'banner') {
    return (
      <section className="py-14 px-6" style={sectionStyle}>
        <div
          className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 rounded-2xl px-8 py-10 sm:flex-row"
          style={{ backgroundColor: 'color-mix(in srgb, var(--accent) 10%, var(--bg))' }}
        >
          <div>
            <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
              {data.headline}
            </h2>
            {data.subheadline && (
              <p className="mt-2 text-sm" style={{ opacity: 0.7 }}>
                {data.subheadline}
              </p>
            )}
          </div>
          {data.ctaText && (
            <a
              href={data.ctaUrl ?? '#'}
              className="shrink-0 font-semibold text-white"
              style={{
                backgroundColor: 'var(--accent)',
                borderRadius: 'var(--radius)',
                padding: '0.875rem 2rem',
              }}
            >
              {data.ctaText}
            </a>
          )}
        </div>
      </section>
    );
  }

  // centered (default)
  return (
    <section className="py-24 px-6 text-center" style={sectionStyle}>
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
