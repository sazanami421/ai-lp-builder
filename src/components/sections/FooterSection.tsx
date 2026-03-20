import { FooterSectionData } from '@/types/section';

type Props = {
  data: FooterSectionData;
};

export default function FooterSection({ data }: Props) {
  return (
    <footer className="bg-gray-900 py-12 px-6 text-gray-400">
      <div className="mx-auto max-w-5xl">
        {data.logo && <img src={data.logo} alt="logo" className="mb-4 h-8" />}
        {data.links && (
          <nav className="mb-6 flex flex-wrap gap-4 text-sm">
            {data.links.map((link, i) => (
              <a key={i} href={link.url} className="hover:text-white">
                {link.label}
              </a>
            ))}
          </nav>
        )}
        <p className="text-sm">{data.copyright}</p>
      </div>
    </footer>
  );
}
