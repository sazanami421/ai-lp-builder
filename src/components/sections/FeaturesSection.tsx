import { FeaturesSectionData } from '@/types/section';

type Props = {
  data: FeaturesSectionData;
};

export default function FeaturesSection({ data }: Props) {
  return (
    <section className="py-20 px-6">
      <h2 className="mb-12 text-center text-3xl font-bold">{data.title}</h2>
      <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {data.items.map((item, i) => (
          <div key={i} className="rounded-lg border p-6">
            {item.icon && <div className="mb-3 text-3xl">{item.icon}</div>}
            <h3 className="mb-2 font-semibold">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
