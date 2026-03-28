import { TestimonialsSectionData } from '@/types/section';
import { getVariant } from '@/lib/variants';
import { buildSectionStyle } from '@/lib/sectionStyle';

type Props = {
  data: TestimonialsSectionData;
  styleOverrides?: Record<string, string>;
};

export default function TestimonialsSection({ data, styleOverrides }: Props) {
  const variant = getVariant('testimonials', data as Record<string, unknown>);

  const sectionStyle = buildSectionStyle('var(--bg-secondary)', styleOverrides);

  if (variant === 'single') {
    const item = data.items[0];
    if (!item) return null;
    return (
      <section className="py-12 px-4 md:py-24 md:px-6" style={sectionStyle}>
        <div className="mx-auto max-w-3xl text-center">
          <h2
            className="mb-8 text-2xl font-bold md:mb-12 md:text-3xl"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {data.title}
          </h2>
          <svg className="mx-auto mb-4 h-8 w-8 opacity-20 md:mb-6 md:h-10 md:w-10" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.192 15.757c0-.88-.23-1.618-.69-2.217-.326-.412-.768-.683-1.327-.812-.55-.128-1.07-.137-1.54-.028-.16-.95.1-1.626.41-2.223.315-.598.803-1.163 1.457-1.693.324-.27.34-.73.046-1.02-.295-.286-.763-.286-1.06-.003-.965.84-1.67 1.718-2.113 2.634-.444.917-.666 1.888-.666 2.914 0 1.01.24 1.832.72 2.468.48.637 1.12.956 1.92.956.8 0 1.45-.305 1.95-.915.5-.61.752-1.39.752-2.343v.329zm8 0c0-.88-.23-1.618-.69-2.217-.326-.412-.768-.683-1.327-.812-.55-.128-1.07-.137-1.54-.028-.16-.95.1-1.626.41-2.223.315-.598.803-1.163 1.457-1.693.324-.27.34-.73.046-1.02-.295-.286-.763-.286-1.06-.003-.965.84-1.67 1.718-2.113 2.634-.444.917-.666 1.888-.666 2.914 0 1.01.24 1.832.72 2.468.48.637 1.12.956 1.92.956.8 0 1.45-.305 1.95-.915.5-.61.752-1.39.752-2.343v.329z" />
          </svg>
          <p className="mb-8 text-base leading-relaxed md:mb-10 md:text-xl" style={{ opacity: 0.85 }}>
            {item.body}
          </p>
          <div className="flex items-center justify-center gap-3 md:gap-4">
            {item.avatarUrl && (
              <img src={item.avatarUrl} alt={item.name} className="h-12 w-12 rounded-full object-cover md:h-14 md:w-14" />
            )}
            <div className="text-left">
              <p className="font-semibold">{item.name}</p>
              {item.role && <p className="text-sm" style={{ opacity: 0.6 }}>{item.role}</p>}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // cards (default)
  return (
    <section className="py-12 px-4 md:py-20 md:px-6" style={sectionStyle}>
      <h2
        className="mb-8 text-center text-2xl font-bold md:mb-12 md:text-3xl"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {data.title}
      </h2>
      <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
        {data.items.map((item, i) => (
          <div
            key={i}
            className="p-5 shadow-sm md:p-6"
            style={{ backgroundColor: 'var(--bg)', borderRadius: 'var(--radius)' }}
          >
            <p className="mb-4 text-sm md:text-base" style={{ opacity: 0.8 }}>&ldquo;{item.body}&rdquo;</p>
            <div className="flex items-center gap-3">
              {item.avatarUrl && (
                <img src={item.avatarUrl} alt={item.name} className="h-10 w-10 rounded-full object-cover" />
              )}
              <div>
                <p className="text-sm font-semibold md:text-base">{item.name}</p>
                {item.role && <p className="text-xs md:text-sm" style={{ opacity: 0.6 }}>{item.role}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
