import { DividerSectionData } from '@/types/section';
import { getVariant } from '@/lib/variants';

type Props = {
  data: DividerSectionData;
  styleOverrides?: Record<string, string>;
};

export default function DividerSection({ data, styleOverrides }: Props) {
  const variant = getVariant('divider', data as Record<string, unknown>);

  if (variant === 'ornament') {
    return (
      <section
        className="py-8 px-4 md:py-12"
        style={{
          color: 'var(--text)',
          fontFamily: 'var(--font-body)',
          ...styleOverrides,
        }}
      >
        <div className="mx-auto flex max-w-2xl items-center gap-4">
          <div className="flex-1 border-t" style={{ borderColor: 'color-mix(in srgb, var(--text) 20%, transparent)' }} />
          <div className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--accent)', opacity: 0.6 }}>
            {data.text ? (
              <span>{data.text}</span>
            ) : (
              <>
                <span>◆</span>
                <span style={{ fontSize: '0.5rem' }}>◆</span>
                <span>◆</span>
              </>
            )}
          </div>
          <div className="flex-1 border-t" style={{ borderColor: 'color-mix(in srgb, var(--text) 20%, transparent)' }} />
        </div>
      </section>
    );
  }

  // gradient（デフォルト）
  return (
    <section
      style={{
        background: 'linear-gradient(135deg, var(--accent-light), color-mix(in srgb, var(--accent) 35%, var(--accent-light)), var(--accent-light))',
        minHeight: '160px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1rem',
        color: 'var(--text)',
        fontFamily: 'var(--font-body)',
        ...styleOverrides,
      }}
    >
      {data.text && (
        <p className="text-xl font-semibold" style={{ opacity: 0.8 }}>
          {data.text}
        </p>
      )}
    </section>
  );
}
