import { FeaturesSectionData } from '@/types/section';

type Props = {
  data: FeaturesSectionData;
  styleOverrides?: Record<string, string>;
};

export default function FeaturesSection({ data, styleOverrides }: Props) {
  return (
    <section
      className="py-20 px-6"
      style={{ backgroundColor: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--font-body)', ...styleOverrides }}
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
