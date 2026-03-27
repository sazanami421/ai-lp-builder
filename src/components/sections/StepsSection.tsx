import { StepsSectionData } from '@/types/section';
import { getVariant } from '@/lib/variants';

type Props = {
  data: StepsSectionData;
  styleOverrides?: Record<string, string>;
};

function isNumeric(str?: string) {
  return str !== undefined && /^\d+$/.test(str.trim());
}

export default function StepsSection({ data, styleOverrides }: Props) {
  const variant = getVariant('steps', data as Record<string, unknown>);

  const sectionStyle = {
    backgroundColor: 'var(--bg)',
    backgroundImage: 'var(--texture)',
    color: 'var(--text)',
    fontFamily: 'var(--font-body)',
    ...styleOverrides,
  };

  if (variant === 'vertical') {
    return (
      <section className="py-12 px-4 md:py-20 md:px-6" style={sectionStyle}>
        <h2
          className="mb-10 text-center text-2xl font-bold md:mb-14 md:text-3xl"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {data.title}
        </h2>
        <div className="mx-auto max-w-2xl space-y-0">
          {data.items.map((item, i) => (
            <div key={i} className="relative flex gap-5">
              {/* 左：アイコン + 縦線 */}
              <div className="flex flex-col items-center">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center text-sm font-bold text-white"
                  style={{ backgroundColor: 'var(--accent)', borderRadius: '50%' }}
                >
                  {isNumeric(item.icon) ? item.icon : (item.icon ?? String(i + 1))}
                </div>
                {i < data.items.length - 1 && (
                  <div
                    className="w-px flex-1 my-1"
                    style={{
                      minHeight: '2rem',
                      backgroundColor: 'color-mix(in srgb, var(--accent) 30%, transparent)',
                    }}
                  />
                )}
              </div>
              {/* 右：テキスト */}
              <div className="pb-10">
                <h3
                  className="mb-1 text-base font-semibold md:text-lg"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ opacity: 0.7 }}>
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // horizontal（デフォルト）
  return (
    <section className="py-12 px-4 md:py-20 md:px-6" style={sectionStyle}>
      <h2
        className="mb-10 text-center text-2xl font-bold md:mb-14 md:text-3xl"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {data.title}
      </h2>
      <div className="mx-auto max-w-4xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-4">
          {data.items.map((item, i) => (
            <div key={i} className="relative flex flex-col items-center text-center">
              {/* ステップ間の矢印（md以上） */}
              {i < data.items.length - 1 && (
                <div
                  className="absolute left-[calc(50%+2.5rem)] top-5 hidden -translate-y-1/2 text-xl md:block"
                  style={{ opacity: 0.3 }}
                >
                  →
                </div>
              )}
              {/* アイコン/番号 */}
              <div
                className="mb-4 flex h-12 w-12 items-center justify-center text-lg font-bold text-white"
                style={{ backgroundColor: 'var(--accent)', borderRadius: '50%' }}
              >
                {isNumeric(item.icon) ? item.icon : (item.icon ?? String(i + 1))}
              </div>
              <h3
                className="mb-2 text-base font-semibold md:text-lg"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ opacity: 0.7 }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
