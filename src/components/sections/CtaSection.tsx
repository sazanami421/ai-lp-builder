import { CtaSectionData } from '@/types/section';
import { getVariant } from '@/lib/variants';
import { buildSectionStyle } from '@/lib/sectionStyle';

type Props = {
  data: CtaSectionData;
  styleOverrides?: Record<string, string>;
};

export default function CtaSection({ data, styleOverrides }: Props) {
  const variant = getVariant('cta', data as Record<string, unknown>);

  const sectionStyle = buildSectionStyle('var(--bg)', styleOverrides);

  if (variant === 'banner') {
    return (
      <section className="py-10 px-4 md:py-14 md:px-6" style={sectionStyle}>
        <div
          className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-5 rounded-2xl px-6 py-8 sm:flex-row md:gap-6 md:px-8 md:py-10"
          style={{ backgroundColor: 'color-mix(in srgb, var(--accent) 10%, var(--bg))' }}
        >
          <div>
            <h2 className="text-xl font-bold md:text-2xl" style={{ fontFamily: 'var(--font-heading)' }}>
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
    <section className="py-12 px-4 text-center md:py-24 md:px-6" style={sectionStyle}>
      <h2
        className="mb-3 text-2xl font-bold md:mb-4 md:text-4xl"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {data.headline}
      </h2>
      {data.subheadline && (
        <p className="mb-6 text-base md:mb-8 md:text-lg" style={{ opacity: 0.7 }}>
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
