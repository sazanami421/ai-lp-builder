import { PricingSectionData } from '@/types/section';
import { getVariant } from '@/lib/variants';

type Props = {
  data: PricingSectionData;
  styleOverrides?: Record<string, string>;
};

export default function PricingSection({ data, styleOverrides }: Props) {
  const variant = getVariant('pricing', data as unknown as Record<string, unknown>);

  if (variant === 'table') {
    return <PricingTable data={data} styleOverrides={styleOverrides} />;
  }
  return <PricingCards data={data} styleOverrides={styleOverrides} />;
}

/** cards: プランカード横並び */
function PricingCards({ data, styleOverrides }: Props) {
  return (
    <section
      className="py-20 px-6"
      style={{
        backgroundColor: 'var(--bg)',
        color: 'var(--text)',
        fontFamily: 'var(--font-body)',
        backgroundImage: 'var(--texture)',
        ...styleOverrides,
      }}
    >
      <h2
        className="mb-12 text-center text-3xl font-bold"
        style={{ fontFamily: 'var(--font-heading)' }}
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
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {plan.name}
            </h3>
            <p className="mb-4 text-3xl font-bold">
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
            {plan.note && (
              <p className="mb-4 text-xs" style={{ opacity: 0.55 }}>{plan.note}</p>
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

/** table: 比較表形式 */
function PricingTable({ data, styleOverrides }: Props) {
  // 全プランの features をユニーク化して行にする
  const allFeatures = Array.from(
    new Set(data.plans.flatMap((p) => p.features))
  );

  return (
    <section
      className="py-20 px-6"
      style={{
        backgroundColor: 'var(--bg)',
        color: 'var(--text)',
        fontFamily: 'var(--font-body)',
        backgroundImage: 'var(--texture)',
        ...styleOverrides,
      }}
    >
      <h2
        className="mb-12 text-center text-3xl font-bold"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {data.title}
      </h2>
      <div className="mx-auto max-w-4xl overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th
                className="border-b px-4 py-3 text-left font-medium"
                style={{ borderColor: 'color-mix(in srgb, var(--text) 15%, transparent)' }}
              />
              {data.plans.map((plan, i) => (
                <th
                  key={i}
                  className="border-b px-4 py-3 text-center"
                  style={{
                    borderColor: 'color-mix(in srgb, var(--text) 15%, transparent)',
                    fontFamily: 'var(--font-heading)',
                  }}
                >
                  <div className="text-lg font-bold">{plan.name}</div>
                  <div className="mt-1 text-2xl font-bold">
                    {plan.price}
                    <span className="text-xs font-normal" style={{ opacity: 0.6 }}>/{plan.period}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allFeatures.map((feature, fi) => (
              <tr
                key={fi}
                style={{
                  backgroundColor: fi % 2 === 0
                    ? 'transparent'
                    : 'color-mix(in srgb, var(--bg) 95%, var(--text) 5%)',
                }}
              >
                <td
                  className="border-b px-4 py-3"
                  style={{
                    borderColor: 'color-mix(in srgb, var(--text) 8%, transparent)',
                    opacity: 0.85,
                  }}
                >
                  {feature}
                </td>
                {data.plans.map((plan, pi) => (
                  <td
                    key={pi}
                    className="border-b px-4 py-3 text-center"
                    style={{ borderColor: 'color-mix(in srgb, var(--text) 8%, transparent)' }}
                  >
                    {plan.features.includes(feature) ? (
                      <span style={{ color: 'var(--accent)' }}>✓</span>
                    ) : (
                      <span style={{ opacity: 0.3 }}>—</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td />
              {data.plans.map((plan, i) => (
                <td key={i} className="px-4 py-4 text-center">
                  {plan.ctaText && (
                    <a
                      href={plan.ctaUrl ?? '#'}
                      className="inline-block px-6 py-2 text-sm font-semibold text-white"
                      style={{
                        backgroundColor: 'var(--accent)',
                        borderRadius: 'var(--radius)',
                      }}
                    >
                      {plan.ctaText}
                    </a>
                  )}
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}
