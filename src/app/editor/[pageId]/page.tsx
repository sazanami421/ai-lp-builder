type Props = {
  params: Promise<{ pageId: string }>;
};

export default async function EditorPage({ params }: Props) {
  const { pageId } = await params;
  return <div>LP エディター: {pageId}</div>;
}
