'use client';

import { useState } from 'react';
import { FormSectionData } from '@/types/section';

type Props = {
  data: FormSectionData;
  styleOverrides?: Record<string, string>;
  pageId?: string; // 公開LP側から渡す。未指定時はプレビューモード（送信不可）
};

export default function FormSection({ data, styleOverrides, pageId }: Props) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pageId) return;

    setStatus('submitting');
    setErrorMsg('');
    try {
      const res = await fetch('/api/form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageId, data: values }),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
    } catch {
      setStatus('error');
      setErrorMsg('送信に失敗しました。時間をおいて再度お試しください。');
    }
  };

  return (
    <section
      className="py-20 px-6"
      style={{ backgroundColor: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--font-body)', ...styleOverrides }}
    >
      <div className="mx-auto max-w-xl">
        {data.title && (
          <h2
            className="mb-3 text-center text-3xl font-bold"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {data.title}
          </h2>
        )}
        {data.description && (
          <p className="mb-8 text-center" style={{ opacity: 0.7 }}>
            {data.description}
          </p>
        )}

        {status === 'success' ? (
          <div
            className="rounded-lg p-6 text-center text-sm"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--accent) 10%, transparent)',
              borderRadius: 'var(--radius)',
            }}
          >
            {data.successMessage}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {data.fields.map((field) => (
              <div key={field.name}>
                <label
                  className="mb-1 block text-sm font-medium"
                >
                  {field.label}
                  {field.required && <span style={{ color: 'var(--accent)' }}> *</span>}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    rows={4}
                    placeholder={field.placeholder}
                    required={field.required}
                    value={values[field.name] ?? ''}
                    onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))}
                    disabled={!pageId || status === 'submitting'}
                    className="w-full resize-none border px-3 py-2 text-sm outline-none transition focus:ring-2 disabled:opacity-60"
                    style={{
                      borderRadius: 'var(--radius)',
                      borderColor: 'color-mix(in srgb, var(--text) 20%, transparent)',
                      backgroundColor: 'var(--bg)',
                      color: 'var(--text)',
                    }}
                  />
                ) : (
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    required={field.required}
                    value={values[field.name] ?? ''}
                    onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))}
                    disabled={!pageId || status === 'submitting'}
                    className="w-full border px-3 py-2 text-sm outline-none transition focus:ring-2 disabled:opacity-60"
                    style={{
                      borderRadius: 'var(--radius)',
                      borderColor: 'color-mix(in srgb, var(--text) 20%, transparent)',
                      backgroundColor: 'var(--bg)',
                      color: 'var(--text)',
                    }}
                  />
                )}
              </div>
            ))}

            {errorMsg && (
              <p className="text-sm text-red-500">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={!pageId || status === 'submitting'}
              className="w-full py-3 text-sm font-semibold text-white transition disabled:opacity-60"
              style={{
                backgroundColor: 'var(--accent)',
                borderRadius: 'var(--radius)',
              }}
            >
              {status === 'submitting' ? '送信中…' : pageId ? data.submitText : `${data.submitText}（プレビュー）`}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
