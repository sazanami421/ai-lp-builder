import { StatsSectionData } from '@/types/section';
import { getVariant } from '@/lib/variants';
import { buildSectionStyle } from '@/lib/sectionStyle';

type Props = {
  data: StatsSectionData;
  styleOverrides?: Record<string, string>;
};

export default function StatsSection({ data, styleOverrides }: Props) {
  const variant = getVariant('stats', data as Record<string, unknown>);

  const sectionStyle = buildSectionStyle('var(--bg)', styleOverrides);

  if (variant === 'cards') {
    return (
      <section className="py-12 px-4 md:py-20 md:px-6" style={sectionStyle}>
        {data.title && (
          <h2
            className="mb-8 text-center text-2xl font-bold md:mb-12 md:text-3xl"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {data.title}
          </h2>
        )}
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {data.items.map((item, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center p-5 text-center"
              style={{
                borderRadius: 'var(--radius)',
                backgroundColor: 'color-mix(in srgb, var(--accent) 8%, transparent)',
                border: 'var(--card-border)',
                boxShadow: 'var(--card-shadow)',
              }}
            >
              <span
                className="text-3xl font-bold leading-none md:text-4xl"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent)' }}
              >
                {item.value}
              </span>
              <span className="mt-2 text-xs md:text-sm" style={{ opacity: 0.7 }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // row（デフォルト）
  return (
    <section className="py-12 px-4 md:py-20 md:px-6" style={sectionStyle}>
      {data.title && (
        <h2
          className="mb-8 text-center text-2xl font-bold md:mb-12 md:text-3xl"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {data.title}
        </h2>
      )}
      <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-10 md:gap-16">
        {data.items.map((item, i) => (
          <div key={i} className="flex flex-col items-center text-center">
            <span
              className="text-4xl font-bold leading-none md:text-5xl"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent)' }}
            >
              {item.value}
            </span>
            <span className="mt-2 text-sm" style={{ opacity: 0.7 }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
