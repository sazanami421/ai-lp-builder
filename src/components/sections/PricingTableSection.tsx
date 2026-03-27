import { PricingTableSectionData } from '@/types/section';

type Props = {
  data: PricingTableSectionData;
  styleOverrides?: Record<string, string>;
};

export default function PricingTableSection({ data, styleOverrides }: Props) {
  const sectionStyle = {
    backgroundColor: 'var(--bg)',
    backgroundImage: 'var(--texture)',
    color: 'var(--text)',
    fontFamily: 'var(--font-body)',
    ...styleOverrides,
  };

  return (
    <section className="py-12 px-4 md:py-20 md:px-6" style={sectionStyle}>
      <h2
        className="mb-8 text-center text-2xl font-bold md:mb-12 md:text-3xl"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {data.title}
      </h2>

      <div className="mx-auto max-w-5xl overflow-x-auto">
        <table className="w-full min-w-[480px] border-collapse text-sm">
          <thead>
            <tr>
              {/* 機能名列のヘッダー */}
              <th className="w-1/3 py-3 pr-4 text-left text-xs font-medium" style={{ opacity: 0.5 }}>
                機能
              </th>
              {data.plans.map((plan, i) => (
                <th
                  key={i}
                  className="px-4 py-3 text-center"
                  style={{
                    borderTopLeftRadius: 'var(--radius)',
                    borderTopRightRadius: 'var(--radius)',
                    backgroundColor: plan.highlighted
                      ? 'color-mix(in srgb, var(--accent) 12%, transparent)'
                      : 'color-mix(in srgb, var(--text) 5%, transparent)',
                    borderTop: plan.highlighted ? '2px solid var(--accent)' : '2px solid transparent',
                  }}
                >
                  <div className="font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                    {plan.name}
                  </div>
                  <div className="mt-1 text-lg font-bold md:text-xl">
                    {plan.price}
                    <span className="text-xs font-normal" style={{ opacity: 0.6 }}>
                      /{plan.period}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.features.map((feature, fi) => (
              <tr
                key={fi}
                style={{
                  borderTop: '1px solid color-mix(in srgb, var(--text) 10%, transparent)',
                }}
              >
                <td className="py-3 pr-4 text-sm" style={{ opacity: 0.85 }}>
                  {feature}
                </td>
                {data.plans.map((plan, pi) => {
                  const val = plan.values[fi];
                  return (
                    <td
                      key={pi}
                      className="px-4 py-3 text-center"
                      style={{
                        backgroundColor: plan.highlighted
                          ? 'color-mix(in srgb, var(--accent) 6%, transparent)'
                          : undefined,
                      }}
                    >
                      {val === true ? (
                        <span className="text-base font-bold" style={{ color: 'var(--accent)' }}>
                          ✓
                        </span>
                      ) : val === false ? (
                        <span className="text-base" style={{ opacity: 0.3 }}>
                          −
                        </span>
                      ) : (
                        <span style={{ opacity: 0.85 }}>{val}</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}

            {/* CTAボタン行 */}
            {data.plans.some((p) => p.ctaText) && (
              <tr style={{ borderTop: '1px solid color-mix(in srgb, var(--text) 10%, transparent)' }}>
                <td className="py-4 pr-4" />
                {data.plans.map((plan, pi) => (
                  <td
                    key={pi}
                    className="px-4 py-4 text-center"
                    style={{
                      backgroundColor: plan.highlighted
                        ? 'color-mix(in srgb, var(--accent) 6%, transparent)'
                        : undefined,
                      borderBottomLeftRadius: 'var(--radius)',
                      borderBottomRightRadius: 'var(--radius)',
                    }}
                  >
                    {plan.ctaText && (
                      <a
                        href={plan.ctaUrl ?? '#'}
                        className="inline-block px-4 py-2 text-xs font-semibold text-white transition"
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
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
