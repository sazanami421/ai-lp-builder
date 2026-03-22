import { CtaSectionData } from '@/types/section';

type Props = {
  data: CtaSectionData;
  styleOverrides?: Record<string, string>;
};

export default function CtaSection({ data, styleOverrides }: Props) {
  return (
    <section
      className="py-24 px-6 text-center"
      style={{ backgroundColor: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--font-body)', ...styleOverrides }}
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
