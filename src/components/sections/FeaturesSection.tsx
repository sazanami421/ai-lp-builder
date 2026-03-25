import { FeaturesSectionData } from '@/types/section';
import { getVariant } from '@/lib/variants';

type Props = {
  data: FeaturesSectionData;
  styleOverrides?: Record<string, string>;
};

export default function FeaturesSection({ data, styleOverrides }: Props) {
  const variant = getVariant('features', data as Record<string, unknown>);

  const sectionStyle = {
    backgroundColor: 'var(--bg)',
    backgroundImage: 'var(--texture)',
    color: 'var(--text)',
    fontFamily: 'var(--font-body)',
    ...styleOverrides,
  };

  const cardStyle = {
    borderRadius: 'var(--radius)',
    borderColor: 'color-mix(in srgb, var(--text) 15%, transparent)',
    backgroundColor: 'color-mix(in srgb, var(--bg) 95%, var(--text) 5%)',
  };

  if (variant === 'alternating') {
    return (
      <section className="py-20 px-6" style={sectionStyle}>
        <h2
          className="mb-16 text-center text-3xl font-bold"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {data.title}
        </h2>
        <div className="mx-auto max-w-5xl space-y-16">
          {data.items.map((item, i) => (
            <div
              key={i}
              className={`flex flex-col items-center gap-10 md:flex-row ${
                i % 2 === 1 ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* 画像 or プレースホルダー */}
              <div className="w-full md:w-1/2">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full rounded-xl object-cover shadow-md"
                    style={{ borderRadius: 'var(--radius)' }}
                  />
                ) : (
                  <div
                    className="flex h-52 w-full items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: 'color-mix(in srgb, var(--accent) 10%, var(--bg))',
                      borderRadius: 'var(--radius)',
                    }}
                  >
                    {item.icon ? (
                      <span className="text-5xl">{item.icon}</span>
                    ) : (
                      <svg className="h-12 w-12 opacity-25" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                      </svg>
                    )}
                  </div>
                )}
              </div>
              {/* テキスト */}
              <div className="w-full md:w-1/2">
                {item.icon && !item.image && (
                  <div className="mb-3 text-3xl">{item.icon}</div>
                )}
                <h3
                  className="mb-3 text-2xl font-bold"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {item.title}
                </h3>
                <p className="leading-relaxed" style={{ opacity: 0.75 }}>
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // grid (default)
  return (
    <section className="py-20 px-6" style={sectionStyle}>
      <h2
        className="mb-12 text-center text-3xl font-bold"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {data.title}
      </h2>
      <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {data.items.map((item, i) => (
          <div key={i} className="border p-6" style={cardStyle}>
            {item.icon && <div className="mb-3 text-3xl">{item.icon}</div>}
            <h3 className="mb-2 font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
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
