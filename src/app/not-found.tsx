import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="mb-2 text-6xl font-bold" style={{ color: '#E5E5E5' }}>
        404
      </p>
      <h1 className="mb-3 text-xl font-semibold text-gray-800">
        ページが見つかりません
      </h1>
      <p className="mb-8 text-sm text-gray-500">
        お探しのページは存在しないか、移動・削除された可能性があります。
      </p>
      <Link
        href="/dashboard"
        className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-700"
      >
        ダッシュボードへ戻る
      </Link>
    </div>
  );
}
