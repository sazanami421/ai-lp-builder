import { PricingSectionData } from '@/types/section';

type Props = {
  data: PricingSectionData;
};

export default function PricingSection({ data }: Props) {
  return (
    <section className="py-20 px-6">
      <h2 className="mb-12 text-center text-3xl font-bold">{data.title}</h2>
      <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.plans.map((plan, i) => (
          <div
            key={i}
            className={`rounded-lg border p-6 ${plan.highlighted ? 'border-[var(--accent)] shadow-lg' : ''}`}
          >
            <h3 className="mb-2 text-xl font-bold">{plan.name}</h3>
            <p className="mb-4 text-3xl font-bold">
              {plan.price}
              <span className="text-base font-normal text-gray-500">/{plan.period}</span>
            </p>
            <ul className="mb-6 space-y-2 text-sm">
              {plan.features.map((f, j) => (
                <li key={j} className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> {f}
                </li>
              ))}
            </ul>
            {plan.ctaText && (
              <a
                href={plan.ctaUrl ?? '#'}
                className="block rounded-full bg-[var(--accent)] py-2 text-center text-sm font-semibold text-white"
              >
                {plan.ctaText}
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
