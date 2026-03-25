import { FooterSectionData } from '@/types/section';
import { getVariant } from '@/lib/variants';

type Props = {
  data: FooterSectionData;
  styleOverrides?: Record<string, string>;
};

export default function FooterSection({ data, styleOverrides }: Props) {
  const variant = getVariant('footer', data as Record<string, unknown>);

  const footerStyle = {
    backgroundColor: 'var(--text)',
    backgroundImage: 'var(--texture)',
    color: 'var(--bg)',
    fontFamily: 'var(--font-body)',
    ...styleOverrides,
  };

  if (variant === 'columns') {
    return (
      <footer className="py-16 px-6" style={footerStyle}>
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {(data.columns ?? []).map((col, i) => (
              <div key={i}>
                <h3 className="mb-3 text-sm font-semibold" style={{ opacity: 0.9 }}>
                  {col.heading}
                </h3>
                <ul className="space-y-2">
                  {col.links.map((link, j) => (
                    <li key={j}>
                      <a
                        href={link.url}
                        style={{ color: 'var(--bg)', opacity: 0.6 }}
                        className="text-sm transition hover:opacity-100"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div
            className="flex flex-col items-start gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between"
            style={{ borderColor: 'color-mix(in srgb, var(--bg) 20%, transparent)' }}
          >
            {data.logo && <img src={data.logo} alt="logo" className="h-7 opacity-80" />}
            <p className="text-sm" style={{ opacity: 0.5 }}>{data.copyright}</p>
          </div>
        </div>
      </footer>
    );
  }

  // minimal (default)
  return (
    <footer className="py-12 px-6" style={footerStyle}>
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
