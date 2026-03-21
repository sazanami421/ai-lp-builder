import { PricingSectionData } from '@/types/section';

type Props = {
  data: PricingSectionData;
  styleOverrides?: Record<string, string>;
};

export default function PricingSection({ data, styleOverrides }: Props) {
  return (
    <section
      className="py-20 px-6"
      style={{ backgroundColor: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--font-body)', ...styleOverrides }}
    >
      <h2
        className="mb-12 text-center text-3xl font-bold"
        style={{ fontFamily: 'var(--font-heading)', color: 'var(--text)' }}
      >
        {data.title}
      </h2>
      <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.plans.map((plan, i) => (
          <div
            key={i}
            className="border p-6"
            style={{
              borderRadius: 'var(--radius)',
              borderColor: plan.highlighted ? 'var(--accent)' : 'color-mix(in srgb, var(--text) 15%, transparent)',
              backgroundColor: 'color-mix(in srgb, var(--bg) 95%, var(--text) 5%)',
              boxShadow: plan.highlighted ? '0 4px 20px color-mix(in srgb, var(--accent) 25%, transparent)' : undefined,
            }}
          >
            <h3
              className="mb-2 text-xl font-bold"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--text)' }}
            >
              {plan.name}
            </h3>
            <p className="mb-4 text-3xl font-bold" style={{ color: 'var(--text)' }}>
              {plan.price}
              <span className="text-base font-normal" style={{ opacity: 0.6 }}>/{plan.period}</span>
            </p>
            <ul className="mb-4 space-y-2 text-sm">
              {plan.features.map((f, j) => (
                <li key={j} className="flex items-center gap-2">
                  <span style={{ color: 'var(--accent)' }}>✓</span>
                  <span style={{ color: 'var(--text)', opacity: 0.85 }}>{f}</span>
                </li>
              ))}
            </ul>
            {plan.note && (
              <p className="mb-4 text-xs" style={{ color: 'var(--text)', opacity: 0.55 }}>{plan.note}</p>
            )}
            {plan.ctaText && (
              <a
                href={plan.ctaUrl ?? '#'}
                className="block py-2 text-center text-sm font-semibold text-white"
                style={{
                  backgroundColor: 'var(--accent)',
                  borderRadius: 'var(--radius)',
                }}
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
