'use client';

import { useState } from 'react';
import { FaqSectionData } from '@/types/section';
import { getVariant } from '@/lib/variants';

type Props = {
  data: FaqSectionData;
  styleOverrides?: Record<string, string>;
};

export default function FaqSection({ data, styleOverrides }: Props) {
  const variant = getVariant('faq', data as unknown as Record<string, unknown>);

  if (variant === 'two-column') {
    return <FaqTwoColumn data={data} styleOverrides={styleOverrides} />;
  }
  return <FaqAccordion data={data} styleOverrides={styleOverrides} />;
}

/** accordion: アコーディオン縦並び */
function FaqAccordion({ data, styleOverrides }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      className="py-20 px-6"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--bg) 93%, var(--text) 7%)',
        color: 'var(--text)',
        fontFamily: 'var(--font-body)',
        backgroundImage: 'var(--texture)',
        ...styleOverrides,
      }}
    >
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
                className="border-t px-5 py-4 text-sm"
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

/** two-column: 2カラム配置（アコーディオンなし、Q&Aを常時展開） */
function FaqTwoColumn({ data, styleOverrides }: Props) {
  return (
    <section
      className="py-20 px-6"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--bg) 93%, var(--text) 7%)',
        color: 'var(--text)',
        fontFamily: 'var(--font-body)',
        backgroundImage: 'var(--texture)',
        ...styleOverrides,
      }}
    >
      <h2
        className="mb-12 text-center text-3xl font-bold"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {data.title}
      </h2>
      <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-2">
        {data.items.map((item, i) => (
          <div
            key={i}
            className="border-l-2 pl-5"
            style={{ borderColor: 'var(--accent)' }}
          >
            <h3
              className="mb-2 font-semibold"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {item.question}
            </h3>
            <p className="text-sm leading-relaxed" style={{ opacity: 0.75 }}>
              {item.answer}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
