import { CtaSectionData } from '@/types/section';

type Props = {
  data: CtaSectionData;
};

export default function CtaSection({ data }: Props) {
  return (
    <section className="py-24 px-6 text-center">
      <h2 className="mb-4 text-4xl font-bold">{data.headline}</h2>
      {data.subheadline && <p className="mb-8 text-lg text-gray-600">{data.subheadline}</p>}
      {data.ctaText && (
        <a
          href={data.ctaUrl ?? '#'}
          className="inline-block rounded-full bg-[var(--accent)] px-10 py-4 font-semibold text-white"
        >
          {data.ctaText}
        </a>
      )}
    </section>
  );
}
