import { TestimonialsSectionData } from '@/types/section';

type Props = {
  data: TestimonialsSectionData;
  styleOverrides?: Record<string, string>;
};

export default function TestimonialsSection({ data, styleOverrides }: Props) {
  return (
    <section
      className="py-20 px-6"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--bg) 93%, var(--text) 7%)',
        color: 'var(--text)',
        fontFamily: 'var(--font-body)',
        ...styleOverrides,
      }}
    >
      <h2
        className="mb-12 text-center text-3xl font-bold"
        style={{ fontFamily: 'var(--font-heading)', color: 'var(--text)' }}
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
              color: 'var(--text)',
            }}
          >
            <p className="mb-4" style={{ color: 'var(--text)', opacity: 0.8 }}>
              &ldquo;{item.body}&rdquo;
            </p>
            <div className="flex items-center gap-3">
              {item.avatarUrl && (
                <img src={item.avatarUrl} alt={item.name} className="h-10 w-10 rounded-full object-cover" />
              )}
              <div>
                <p className="font-semibold" style={{ color: 'var(--text)' }}>{item.name}</p>
                {item.role && (
                  <p className="text-sm" style={{ color: 'var(--text)', opacity: 0.6 }}>{item.role}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
