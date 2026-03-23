import { TestimonialsSectionData } from '@/types/section';
import { getVariant } from '@/lib/variants';

type Props = {
  data: TestimonialsSectionData;
  styleOverrides?: Record<string, string>;
};

export default function TestimonialsSection({ data, styleOverrides }: Props) {
  const variant = getVariant('testimonials', data as unknown as Record<string, unknown>);

  if (variant === 'single') {
    return <TestimonialsSingle data={data} styleOverrides={styleOverrides} />;
  }
  return <TestimonialsCards data={data} styleOverrides={styleOverrides} />;
}

/** cards: カード型で横に並べる */
function TestimonialsCards({ data, styleOverrides }: Props) {
  return (
    <section
      className="py-20 px-6"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--bg) 93%, var(--text) 7%)',
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
      <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.items.map((item, i) => (
          <div
            key={i}
            className="p-6 shadow-sm"
            style={{
              backgroundColor: 'var(--bg)',
              borderRadius: 'var(--radius)',
            }}
          >
            <p className="mb-4" style={{ opacity: 0.8 }}>
              &ldquo;{item.body}&rdquo;
            </p>
            <div className="flex items-center gap-3">
              {item.avatarUrl && (
                <img src={item.avatarUrl} alt={item.name} className="h-10 w-10 rounded-full object-cover" />
              )}
              <div>
                <p className="font-semibold">{item.name}</p>
                {item.role && (
                  <p className="text-sm" style={{ opacity: 0.6 }}>{item.role}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/** single: 1件ずつ大きく表示 */
function TestimonialsSingle({ data, styleOverrides }: Props) {
  // 最初の1件を大きく表示（複数ある場合は1件目のみ）
  const item = data.items[0];
  if (!item) return null;

  return (
    <section
      className="py-24 px-6"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--bg) 93%, var(--text) 7%)',
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
      <div className="mx-auto max-w-3xl text-center">
        <blockquote
          className="mb-8 text-2xl font-medium leading-relaxed"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          &ldquo;{item.body}&rdquo;
        </blockquote>
        <div className="flex flex-col items-center gap-3">
          {item.avatarUrl && (
            <img src={item.avatarUrl} alt={item.name} className="h-16 w-16 rounded-full object-cover" />
          )}
          <div>
            <p className="text-lg font-semibold">{item.name}</p>
            {item.role && (
              <p className="text-sm" style={{ opacity: 0.6 }}>{item.role}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
