type Props = {
  params: Promise<{ slug: string }>;
};

export default async function PublicLPPage({ params }: Props) {
  const { slug } = await params;
  // TODO: slug で LP データを取得してレンダリング
  return <div>公開 LP: {slug}</div>;
}
