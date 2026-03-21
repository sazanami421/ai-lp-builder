'use client';

import { useState } from 'react';
import { FaqSectionData } from '@/types/section';

type Props = {
  data: FaqSectionData;
  styleOverrides?: Record<string, string>;
};

export default function FaqSection({ data, styleOverrides }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
      <div className="mx-auto max-w-2xl space-y-3">
        {data.items.map((item, i) => (
          <div
            key={i}
            className="border"
            style={{
              borderRadius: 'var(--radius)',
              borderColor: 'color-mix(in srgb, var(--text) 15%, transparent)',
              backgroundColor: 'var(--bg)',
            }}
          >
            <button
              className="flex w-full items-center justify-between px-5 py-4 text-left font-medium"
              style={{ color: 'var(--text)' }}
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            >
              {item.question}
              <span style={{ color: 'var(--accent)' }}>{openIndex === i ? '−' : '+'}</span>
            </button>
            {openIndex === i && (
              <div
                className="border-t px-5 py-4 text-sm"
                style={{
                  borderColor: 'color-mix(in srgb, var(--text) 10%, transparent)',
                  color: 'var(--text)',
                  opacity: 0.75,
                }}
              >
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
