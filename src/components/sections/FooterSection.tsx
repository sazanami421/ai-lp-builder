import { FooterSectionData } from '@/types/section';

type Props = {
  data: FooterSectionData;
  styleOverrides?: Record<string, string>;
};

export default function FooterSection({ data, styleOverrides }: Props) {
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
