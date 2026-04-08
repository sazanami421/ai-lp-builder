import { PricingSectionData } from '@/types/section';
import { buildSectionStyle } from '@/lib/sectionStyle';

type Props = {
  data: PricingSectionData;
  styleOverrides?: Record<string, string>;
};

export default function PricingSection({ data, styleOverrides }: Props) {
  const sectionStyle = buildSectionStyle('var(--bg)', styleOverrides);

  return (
    <section className="py-12 px-4 md:py-20 md:px-6" style={sectionStyle}>
      <h2
        className="mb-8 text-center text-2xl font-bold md:mb-12 md:text-3xl"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {data.title}
      </h2>
      <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
        {data.plans.map((plan, i) => (
          <div
            key={i}
            className="p-5 md:p-6"
            style={{
              borderRadius: 'var(--radius)',
              border: plan.highlighted ? '2px solid var(--accent)' : 'var(--card-border)',
              backgroundColor: 'color-mix(in srgb, var(--bg) 95%, var(--text) 5%)',
              boxShadow: plan.highlighted ? '0 4px 20px color-mix(in srgb, var(--accent) 25%, transparent)' : 'var(--card-shadow)',
            }}
          >
            <h3 className="mb-2 text-xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
              {plan.name}
            </h3>
            <p className="mb-4 text-2xl font-bold md:text-3xl">
              {plan.price}
              <span className="text-base font-normal" style={{ opacity: 0.6 }}>/{plan.period}</span>
            </p>
            <ul className="mb-4 space-y-2 text-sm">
              {plan.features.map((f, j) => (
                <li key={j} className="flex items-center gap-2">
                  <span style={{ color: 'var(--accent)' }}>✓</span>
                  <span style={{ opacity: 0.85 }}>{f}</span>
                </li>
              ))}
            </ul>
            {plan.note && <p className="mb-4 text-xs" style={{ opacity: 0.55 }}>{plan.note}</p>}
            {plan.ctaText && (
              <a
                href={plan.ctaUrl ?? '#'}
                className="block py-2 text-center text-sm font-semibold text-white"
                style={{ backgroundColor: 'var(--accent)', borderRadius: 'var(--button-radius)', boxShadow: 'var(--button-shadow)' }}
              >
                {plan.ctaText}
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
