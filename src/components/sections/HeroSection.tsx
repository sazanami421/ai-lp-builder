import { HeroSectionData } from '@/types/section';

type Props = {
  data: HeroSectionData;
};

export default function HeroSection({ data }: Props) {
  return (
    <section className="relative flex min-h-[80vh] flex-col items-center justify-center text-center">
      {data.backgroundImage && (
        <img
          src={data.backgroundImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className="relative z-10 px-6">
        <h1 className="text-5xl font-bold">{data.headline}</h1>
        {data.subheadline && <p className="mt-4 text-xl">{data.subheadline}</p>}
        {data.ctaText && (
          <a
            href={data.ctaUrl ?? '#'}
            className="mt-8 inline-block rounded-full bg-[var(--accent)] px-8 py-4 font-semibold text-white"
          >
            {data.ctaText}
          </a>
        )}
      </div>
    </section>
  );
}
