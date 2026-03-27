import { GallerySectionData } from '@/types/section';
import { getVariant } from '@/lib/variants';

type Props = {
  data: GallerySectionData;
  styleOverrides?: Record<string, string>;
};

function GalleryItem({ imageUrl, caption }: { imageUrl: string; caption?: string }) {
  return (
    <div className="break-inside-avoid overflow-hidden" style={{ borderRadius: 'var(--radius)' }}>
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt={caption ?? ''}
          className="w-full object-cover"
          style={{ borderRadius: 'var(--radius)' }}
        />
      ) : (
        <div
          className="flex aspect-video w-full items-center justify-center"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--accent) 10%, transparent)',
            borderRadius: 'var(--radius)',
          }}
        >
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ opacity: 0.3 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5M12 3v1.5M6.75 3v1.5M17.25 3v1.5" />
          </svg>
        </div>
      )}
      {caption && (
        <p className="mt-1.5 px-0.5 text-xs" style={{ opacity: 0.6 }}>
          {caption}
        </p>
      )}
    </div>
  );
}

export default function GallerySection({ data, styleOverrides }: Props) {
  const variant = getVariant('gallery', data as Record<string, unknown>);

  const sectionStyle = {
    backgroundColor: 'var(--bg)',
    backgroundImage: 'var(--texture)',
    color: 'var(--text)',
    fontFamily: 'var(--font-body)',
    ...styleOverrides,
  };

  return (
    <section className="py-12 px-4 md:py-20 md:px-6" style={sectionStyle}>
      {data.title && (
        <h2
          className="mb-8 text-center text-2xl font-bold md:mb-12 md:text-3xl"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {data.title}
        </h2>
      )}

      {variant === 'masonry' ? (
        <div className="mx-auto max-w-5xl columns-2 gap-4 md:columns-3">
          {data.items.map((item, i) => (
            <div key={i} className="mb-4">
              <GalleryItem {...item} />
            </div>
          ))}
        </div>
      ) : (
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 md:grid-cols-3">
          {data.items.map((item, i) => (
            <GalleryItem key={i} {...item} />
          ))}
        </div>
      )}
    </section>
  );
}
