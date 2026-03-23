import { FeaturesSectionData } from '@/types/section';
import { getVariant } from '@/lib/variants';

type Props = {
  data: FeaturesSectionData;
  styleOverrides?: Record<string, string>;
};

export default function FeaturesSection({ data, styleOverrides }: Props) {
  const variant = getVariant('features', data as unknown as Record<string, unknown>);

  if (variant === 'alternating') {
    return <FeaturesAlternating data={data} styleOverrides={styleOverrides} />;
  }
  return <FeaturesGrid data={data} styleOverrides={styleOverrides} />;
}

/** grid: カード型グリッド */
function FeaturesGrid({ data, styleOverrides }: Props) {
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
      <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {data.items.map((item, i) => (
          <div
            key={i}
            className="border p-6"
            style={{
              borderRadius: 'var(--radius)',
              borderColor: 'color-mix(in srgb, var(--text) 15%, transparent)',
              backgroundColor: 'color-mix(in srgb, var(--bg) 95%, var(--text) 5%)',
            }}
          >
            {item.icon && <div className="mb-3 text-3xl">{item.icon}</div>}
            <h3
              className="mb-2 font-semibold"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {item.title}
            </h3>
            <p className="text-sm" style={{ opacity: 0.7 }}>
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/** alternating: 左右交互レイアウト（画像+テキスト） */
function FeaturesAlternating({ data, styleOverrides }: Props) {
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
        className="mb-16 text-center text-3xl font-bold"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {data.title}
      </h2>
      <div className="mx-auto max-w-5xl space-y-20">
        {data.items.map((item, i) => {
          const isReversed = i % 2 === 1;
          return (
            <div
              key={i}
              className={`grid grid-cols-1 items-center gap-12 md:grid-cols-2 ${
                isReversed ? 'md:[direction:rtl]' : ''
              }`}
            >
              {/* 画像 */}
              <div className={isReversed ? 'md:[direction:ltr]' : ''}>
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full rounded-lg object-cover"
                    style={{ borderRadius: 'var(--radius)', maxHeight: '320px' }}
                  />
                ) : (
                  <div
                    className="flex h-56 w-full items-center justify-center text-4xl"
                    style={{
                      backgroundColor: 'color-mix(in srgb, var(--bg) 90%, var(--text) 10%)',
                      borderRadius: 'var(--radius)',
                    }}
                  >
                    {item.icon || '📌'}
                  </div>
                )}
              </div>
              {/* テキスト */}
              <div className={isReversed ? 'md:[direction:ltr]' : ''}>
                <h3
                  className="mb-3 text-2xl font-bold"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {item.title}
                </h3>
                <p className="text-base leading-relaxed" style={{ opacity: 0.75 }}>
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
