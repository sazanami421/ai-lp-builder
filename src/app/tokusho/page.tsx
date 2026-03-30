import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '特定商取引法に基づく表記 | ひとまずAI-LP',
};

const ITEMS = [
  { label: '販売業者名', value: '株式会社みずかげ製作所' },
  { label: '代表者名', value: '小杉 啓太' },
  { label: '所在地', value: '神奈川県横浜市中区桜木町2-2 港陽ビル5階' },
  { label: '電話番号', value: '080-9370-1784' },
  { label: 'メールアドレス', value: 'info@mizukage.jp' },
  {
    label: '販売価格',
    value: 'Freeプラン：0円 / Proプラン：3,000円（税込）／月',
  },
  { label: '料金以外の費用', value: 'なし' },
  { label: '支払方法', value: 'クレジットカード（Stripe経由）' },
  { label: '支払時期', value: '月払い（サービス利用開始日より毎月自動更新）' },
  { label: 'サービス提供時期', value: '決済完了後すぐにご利用いただけます' },
  {
    label: '返品・キャンセルについて',
    value: 'デジタルコンテンツの性質上、原則として返金はいたしかねます。解約はマイページよりいつでも手続き可能です。解約後は当該月末までご利用いただけます。',
  },
  {
    label: '動作環境',
    value: 'PC（Windows / Mac）。モバイル端末には対応しておりません。動作確認済みブラウザ：Google Chrome（最新版）',
  },
];

export default function TokushoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        {/* ヘッダー */}
        <div className="mb-10">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-400 transition hover:text-gray-600"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            トップへ戻る
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">特定商取引法に基づく表記</h1>
        </div>

        {/* テーブル */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="w-full">
            <tbody className="divide-y divide-gray-100">
              {ITEMS.map(({ label, value }) => (
                <tr key={label}>
                  <th
                    scope="row"
                    className="w-40 shrink-0 bg-gray-50 px-6 py-4 text-left text-sm font-medium text-gray-600 align-top sm:w-48"
                  >
                    {label}
                  </th>
                  <td className="px-6 py-4 text-sm leading-relaxed text-gray-800">
                    {value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-8 text-xs text-gray-400">
          本ページの内容は予告なく変更される場合があります。
        </p>
      </div>
    </div>
  );
}
