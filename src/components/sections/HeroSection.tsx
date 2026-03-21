import { HeroSectionData } from '@/types/section';

type Props = {
  data: HeroSectionData;
  styleOverrides?: Record<string, string>;
};

export default function HeroSection({ data, styleOverrides }: Props) {
  return (
    <section
      className="relative flex min-h-[80vh] flex-col items-center justify-center text-center"
      style={{ backgroundColor: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--font-body)', ...styleOverrides }}
    >
      {data.backgroundImage && (
        <img
          src={data.backgroundImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className="relative z-10 px-6">
        <h1
          className="text-5xl font-bold"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--text)' }}
        >
          {data.headline}
        </h1>
        {data.subheadline && (
          <p className="mt-4 text-xl" style={{ color: 'var(--text)', opacity: 0.75 }}>
            {data.subheadline}
          </p>
        )}
        {data.ctaText && (
          <a
            href={data.ctaUrl ?? '#'}
            className="mt-8 inline-block font-semibold text-white"
            style={{
              backgroundColor: 'var(--accent)',
              borderRadius: 'var(--radius)',
              padding: '1rem 2rem',
            }}
          >
            {data.ctaText}
          </a>
        )}
      </div>
    </section>
  );
}
