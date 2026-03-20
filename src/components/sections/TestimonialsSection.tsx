import { TestimonialsSectionData } from '@/types/section';

type Props = {
  data: TestimonialsSectionData;
};

export default function TestimonialsSection({ data }: Props) {
  return (
    <section className="py-20 px-6 bg-gray-50">
      <h2 className="mb-12 text-center text-3xl font-bold">{data.title}</h2>
      <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.items.map((item, i) => (
          <div key={i} className="rounded-lg bg-white p-6 shadow-sm">
            <p className="mb-4 text-gray-700">&ldquo;{item.body}&rdquo;</p>
            <div className="flex items-center gap-3">
              {item.avatarUrl && (
                <img src={item.avatarUrl} alt={item.name} className="h-10 w-10 rounded-full object-cover" />
              )}
              <div>
                <p className="font-semibold">{item.name}</p>
                {item.role && <p className="text-sm text-gray-500">{item.role}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
