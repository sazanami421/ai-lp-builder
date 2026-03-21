import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

type Props = {
  params: Promise<{ projectId: string }>;
};

export default async function SubmissionsPage({ params }: Props) {
  const { projectId } = await params;
  const session = await getServerSession(authOptions);

  const project = await prisma.project.findUnique({
    where: { id: projectId, userId: session!.user.id },
    include: {
      pages: {
        include: {
          formSubmissions: {
            orderBy: { createdAt: 'desc' },
          },
        },
      },
    },
  });

  if (!project) notFound();

  const allSubmissions = project.pages
    .flatMap((p) => p.formSubmissions)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const allKeys = Array.from(
    new Set(
      allSubmissions.flatMap((s) => Object.keys(s.data as Record<string, string>))
    )
  );

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Link
              href="/dashboard"
              className="text-sm text-gray-400 transition hover:text-gray-600"
            >
              プロジェクト
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-sm text-gray-600">{project.name}</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">フォーム送信データ</h1>
          <p className="mt-1 text-sm text-gray-500">
            {allSubmissions.length > 0
              ? `${allSubmissions.length} 件の送信データ`
              : '送信データはまだありません'}
          </p>
        </div>
        <Link
          href={`/editor/${projectId}`}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          エディターへ
        </Link>
      </div>

      {allSubmissions.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white px-6 py-24 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
            <svg className="h-7 w-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-base font-semibold text-gray-900">まだ送信データがありません</h2>
          <p className="mt-2 max-w-xs text-sm text-gray-500">
            LPを公開してフォームから問い合わせを受け付けると、ここに表示されます。
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  受信日時
                </th>
                {allKeys.map((key) => (
                  <th
                    key={key}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allSubmissions.map((submission) => {
                const data = submission.data as Record<string, string>;
                const date = new Intl.DateTimeFormat('ja-JP', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                }).format(new Date(submission.createdAt));
                return (
                  <tr key={submission.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-3 text-gray-500">{date}</td>
                    {allKeys.map((key) => (
                      <td key={key} className="px-4 py-3 text-gray-700">
                        {data[key] ?? '—'}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
