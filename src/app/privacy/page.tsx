import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'プライバシーポリシー | ひとまずAI-LP',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
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
          <h1 className="text-2xl font-bold text-gray-900">プライバシーポリシー</h1>
          <p className="mt-2 text-sm text-gray-500">施行日：2026年○月○日</p>
        </div>

        <div className="space-y-8 rounded-xl border border-gray-200 bg-white px-8 py-10 text-sm leading-relaxed text-gray-700">

          <section>
            <h2 className="mb-3 text-base font-semibold text-gray-900">第1条（事業者情報）</h2>
            <p>株式会社みずかげ製作所（以下「当社」）は、本サービス「ひとまずAI-LP」（以下「本サービス」）におけるユーザーの個人情報の取り扱いについて、以下の通りプライバシーポリシー（以下「本ポリシー」）を定めます。</p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold text-gray-900">第2条（収集する個人情報）</h2>
            <p className="mb-2">当社は、以下の情報を収集することがあります。</p>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>氏名・メールアドレス・会社名・電話番号（アカウント登録時）</li>
              <li>Googleアカウント情報（Google認証でログインした場合）</li>
              <li>決済に関する情報（クレジットカード情報はStripeが管理し、当社は保持しません）</li>
              <li>本サービス上で作成・入力したコンテンツ</li>
              <li>アクセスログ・IPアドレス・ブラウザ情報等</li>
              <li>Cookieおよびこれに類する技術により収集される情報</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold text-gray-900">第3条（利用目的）</h2>
            <p className="mb-2">収集した情報は、以下の目的に利用します。</p>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>本サービスの提供・運営・改善</li>
              <li>ユーザー認証およびアカウント管理</li>
              <li>料金の請求・決済処理</li>
              <li>カスタマーサポート・お問い合わせへの対応</li>
              <li>サービスに関する重要なお知らせの送信</li>
              <li>メールマガジン・アップデート情報・プロモーションメールの送信</li>
              <li>Freeプランユーザーへの広告表示</li>
              <li>アクセス解析によるサービス改善</li>
              <li>不正利用の検知・防止</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold text-gray-900">第4条（Cookieおよびアクセス解析）</h2>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>本サービスはCookieを使用してユーザーのログイン状態の維持等を行います。</li>
              <li>本サービスはGoogle Analyticsを使用してアクセス状況を分析しています。Google Analyticsはデータ収集のためにCookieを使用します。収集されたデータはGoogleのプライバシーポリシーに基づき管理されます。</li>
              <li>ブラウザの設定によりCookieを無効化することができますが、一部機能が利用できなくなる場合があります。</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold text-gray-900">第5条（広告の表示）</h2>
            <p>Freeプランのユーザーに対しては、本サービス内に広告が表示される場合があります。広告の表示にあたりCookieや利用状況に関する情報が使用される場合があります。</p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold text-gray-900">第6条（第三者提供）</h2>
            <p className="mb-2">当社は、以下の場合を除き、ユーザーの個人情報を第三者に提供しません。</p>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>ユーザーの同意がある場合</li>
              <li>法令に基づく場合</li>
              <li>人の生命・身体・財産の保護のために必要な場合</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold text-gray-900">第7条（外部サービスへの情報提供）</h2>
            <p className="mb-2">本サービスは以下の外部サービスを利用しており、各社のプライバシーポリシーに従い情報が処理される場合があります。</p>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Stripe（決済処理）</li>
              <li>Google（認証・アクセス解析）</li>
              <li>Supabase（データ保存）</li>
              <li>Vercel（ホスティング）</li>
              <li>Anthropic（AI生成機能）</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold text-gray-900">第8条（メールの配信停止）</h2>
            <p>メールマガジン・プロモーションメールの受信を希望されない場合は、メール内の配信停止リンクまたは <a href="mailto:info@mizukage.jp" className="underline hover:no-underline">info@mizukage.jp</a> までご連絡ください。なお、サービスに関する重要なお知らせ（利用規約変更・アカウント通知等）は引き続き送信される場合があります。</p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold text-gray-900">第9条（個人情報の管理・安全対策）</h2>
            <p>当社は、個人情報の漏洩・滅失・毀損を防止するために適切な安全管理措置を講じます。ただし、インターネット上の通信は完全な安全性を保証するものではなく、当社は情報漏洩等により生じた損害について一切の責任を負いません。</p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold text-gray-900">第10条（開示・訂正・削除）</h2>
            <p>ユーザーは、自身の個人情報の開示・訂正・削除を希望する場合、<a href="mailto:info@mizukage.jp" className="underline hover:no-underline">info@mizukage.jp</a> までご連絡ください。本人確認の上、合理的な範囲で対応します。</p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold text-gray-900">第11条（ポリシーの変更）</h2>
            <p>当社は必要に応じて本ポリシーを変更することができます。変更後のポリシーは本サービス上に掲示した時点から効力を生じます。</p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold text-gray-900">第12条（お問い合わせ）</h2>
            <p>本ポリシーに関するお問い合わせは、<a href="mailto:info@mizukage.jp" className="underline hover:no-underline">info@mizukage.jp</a> までご連絡ください。</p>
          </section>

        </div>

        <p className="mt-8 text-xs text-gray-400">
          株式会社みずかげ製作所
        </p>
      </div>
    </div>
  );
}
