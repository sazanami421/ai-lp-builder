'use client';

import { useState } from 'react';
import { FaqSectionData } from '@/types/section';

type Props = {
  data: FaqSectionData;
};

export default function FaqSection({ data }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 px-6 bg-gray-50">
      <h2 className="mb-12 text-center text-3xl font-bold">{data.title}</h2>
      <div className="mx-auto max-w-2xl space-y-3">
        {data.items.map((item, i) => (
          <div key={i} className="rounded-lg border bg-white">
            <button
              className="flex w-full items-center justify-between px-5 py-4 text-left font-medium"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            >
              {item.question}
              <span>{openIndex === i ? '−' : '+'}</span>
            </button>
            {openIndex === i && (
              <div className="border-t px-5 py-4 text-sm text-gray-600">{item.answer}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
