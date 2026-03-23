import { FooterSectionData } from '@/types/section';
import { getVariant } from '@/lib/variants';

type Props = {
  data: FooterSectionData;
  styleOverrides?: Record<string, string>;
};

export default function FooterSection({ data, styleOverrides }: Props) {
  const variant = getVariant('footer', data as unknown as Record<string, unknown>);

  if (variant === 'columns') {
    return <FooterColumns data={data} styleOverrides={styleOverrides} />;
  }
  return <FooterMinimal data={data} styleOverrides={styleOverrides} />;
}

/** minimal: 1行シンプル */
function FooterMinimal({ data, styleOverrides }: Props) {
  return (
    <footer
      className="py-12 px-6"
      style={{
        backgroundColor: 'var(--text)',
        color: 'var(--bg)',
        fontFamily: 'var(--font-body)',
        ...styleOverrides,
      }}
    >
      <div className="mx-auto max-w-5xl">
        {data.logo && <img src={data.logo} alt="logo" className="mb-4 h-8" />}
        {data.links && (
          <nav className="mb-6 flex flex-wrap gap-4 text-sm">
            {data.links.map((link, i) => (
              <a
                key={i}
                href={link.url}
                style={{ color: 'var(--bg)', opacity: 0.7 }}
                className="transition hover:opacity-100"
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}
        <p className="text-sm" style={{ opacity: 0.5 }}>{data.copyright}</p>
      </div>
    </footer>
  );
}

/** columns: 複数カラム（ロゴ + リンクグループ + コピーライト） */
function FooterColumns({ data, styleOverrides }: Props) {
  // リンクを2グループに分割（将来的にはカテゴリ分けも可能）
  const links = data.links ?? [];
  const mid = Math.ceil(links.length / 2);
  const col1 = links.slice(0, mid);
  const col2 = links.slice(mid);

  return (
    <footer
      className="py-16 px-6"
      style={{
        backgroundColor: 'var(--text)',
        color: 'var(--bg)',
        fontFamily: 'var(--font-body)',
        ...styleOverrides,
      }}
    >
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 sm:grid-cols-3">
        {/* ロゴ + コピーライト */}
        <div>
          {data.logo && <img src={data.logo} alt="logo" className="mb-4 h-8" />}
          <p className="text-sm" style={{ opacity: 0.5 }}>{data.copyright}</p>
        </div>

        {/* リンクカラム1 */}
        {col1.length > 0 && (
          <nav className="flex flex-col gap-3 text-sm">
            {col1.map((link, i) => (
              <a
                key={i}
                href={link.url}
                style={{ color: 'var(--bg)', opacity: 0.7 }}
                className="transition hover:opacity-100"
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}

        {/* リンクカラム2 */}
        {col2.length > 0 && (
          <nav className="flex flex-col gap-3 text-sm">
            {col2.map((link, i) => (
              <a
                key={i}
                href={link.url}
                style={{ color: 'var(--bg)', opacity: 0.7 }}
                className="transition hover:opacity-100"
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </footer>
  );
}
