'use client';

import { useState } from 'react';
import { FaqSectionData } from '@/types/section';
import { getVariant } from '@/lib/variants';
import { buildSectionStyle } from '@/lib/sectionStyle';

type Props = {
  data: FaqSectionData;
  styleOverrides?: Record<string, string>;
};

export default function FaqSection({ data, styleOverrides }: Props) {
  const variant = getVariant('faq', data as Record<string, unknown>);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const sectionStyle = buildSectionStyle('var(--bg-secondary)', styleOverrides);

  if (variant === 'two-column') {
    return (
      <section className="py-12 px-4 md:py-20 md:px-6" style={sectionStyle}>
        <h2
          className="mb-8 text-center text-2xl font-bold md:mb-12 md:text-3xl"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {data.title}
        </h2>
        <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
          {data.items.map((item, i) => (
            <div
              key={i}
              className="p-5"
              style={{
                borderRadius: 'var(--radius)',
                backgroundColor: 'var(--bg)',
                boxShadow: '0 1px 4px color-mix(in srgb, var(--text) 8%, transparent)',
              }}
            >
              <p className="mb-2 font-semibold" style={{ color: 'var(--accent)' }}>
                Q. {item.question}
              </p>
              <p className="whitespace-pre-wrap text-sm" style={{ opacity: 0.75 }}>
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // accordion (default)
  return (
    <section className="py-20 px-6" style={sectionStyle}>
      <h2
        className="mb-12 text-center text-3xl font-bold"
        style={{ fontFamily: 'var(--font-heading)' }}
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
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            >
              {item.question}
              <span style={{ color: 'var(--accent)' }}>{openIndex === i ? '−' : '+'}</span>
            </button>
            {openIndex === i && (
              <div
                className="whitespace-pre-wrap border-t px-5 py-4 text-sm"
                style={{
                  borderColor: 'color-mix(in srgb, var(--text) 10%, transparent)',
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
