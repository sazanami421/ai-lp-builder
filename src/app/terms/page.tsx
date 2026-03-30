import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '利用規約 | ひとまずAI-LP',
};

export default function TermsPage() {
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
          <h1 className="text-2xl font-bold text-gray-900">利用規約</h1>
          <p className="mt-2 text-sm text-gray-500">施行日：2026年○月○日</p>
        </div>

        <div className="space-y-8 rounded-xl border border-gray-200 bg-white px-8 py-10 text-sm leading-relaxed text-gray-700">

          <section>
            <h2 className="mb-3 text-base font-semibold text-gray-900">第1条（適用）</h2>
            <p>本利用規約（以下「本規約」）は、株式会社みずかげ製作所（以下「当社」）が提供するサービス「ひとまずAI-LP」（以下「本サービス」）の利用に関する条件を定めるものです。ユーザーは本規約に同意した上で本サービスをご利用ください。本サービスを利用した時点で、本規約に同意したものとみなします。</p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold text-gray-900">第2条（アカウント）</h2>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>ユーザーは正確な情報を登録するものとします。</li>
              <li>アカウントの管理はユーザー自身の責任において行うものとし、第三者への譲渡・貸与は禁止します。</li>
              <li>アカウントの不正利用等により生じた損害について、当社は一切の責任を負いません。</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold text-gray-900">第3条（料金・支払い）</h2>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>各プランの料金は本サービス上に表示する金額とします。</li>
              <li>有料プランの料金は月払いとし、契約開始日を起算日として毎月自動更新されます。</li>
              <li>支払いはクレジットカード（Stripe経由）にて行います。</li>
              <li>デジタルコンテンツの性質上、原則として支払済みの料金の返金はいたしかねます。</li>
              <li>解約はマイページよりいつでも手続き可能です。解約後は当該請求期間の末日までご利用いただけます。</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold text-gray-900">第4条（禁止事項）</h2>
            <p className="mb-2">ユーザーは以下の行為を行ってはなりません。</p>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>法令または公序良俗に違反する行為</li>
              <li>詐欺・虚偽情報・誤情報の拡散など、反社会的行為に関わるコンテンツの作成・公開</li>
              <li>反社会的勢力との関係に関わる行為</li>
              <li>他者の著作権・商標権・プライバシー等の権利を侵害する行為</li>
              <li>本サービスへの不正アクセス・クラッキング・過負荷をかける行為</li>
              <li>スパムや迷惑メールの送信に本サービスを利用する行為</li>
              <li>当社または第三者を誹謗中傷する行為</li>
              <li>その他、当社が不適切と判断する行為</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold text-gray-900">第5条（コンテンツの権利）</h2>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>ユーザーが本サービスを通じて作成・公開したコンテンツの著作権はユーザーに帰属します。</li>
              <li>ユーザーは当社に対し、サービス提供・改善に必要な範囲でコンテンツを利用する権利を許諾するものとします。</li>
              <li>ユーザーは、自身のコンテンツが第三者の権利を侵害しないことを保証するものとします。</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold text-gray-900">第6条（AIによるコンテンツ生成）</h2>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>本サービスはAIを用いてコンテンツを生成しますが、その正確性・完全性・適切性について当社は一切保証しません。</li>
              <li>AIが生成したコンテンツの内容・品質・成果について、当社は一切の責任を負いません。</li>
              <li>ユーザーはAIが生成したコンテンツを自己の責任において確認・修正の上、利用するものとします。</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold text-gray-900">第7条（免責事項）</h2>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>当社は、本サービスの継続的な提供・動作保証・特定目的への適合性について、いかなる保証も行いません。</li>
              <li>本サービスの利用または利用不能により生じた直接・間接・付随的・特別・結果的損害について、当社は一切の責任を負いません。</li>
              <li>サービスの停止・変更・中断・終了により生じた損害についても、当社は一切の責任を負いません。</li>
              <li>ユーザーが本サービスを通じて公開したLPやコンテンツに起因して生じた第三者との紛争・損害について、当社は一切の責任を負いません。</li>
              <li>外部サービス（Stripe・Google・Supabase等）に起因する障害・損害について、当社は一切の責任を負いません。</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold text-gray-900">第8条（サービスの変更・終了）</h2>
            <p>当社は、ユーザーへの事前通知なく、本サービスの内容の変更・機能の追加または削除・サービスの停止・終了を行うことができます。これらによりユーザーに生じた損害について、当社は一切の責任を負いません。</p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold text-gray-900">第9条（アカウントの停止・削除）</h2>
            <p>当社は、ユーザーが本規約に違反した場合、または当社が不適切と判断した場合、事前通知なくアカウントを停止・削除することができます。これにより生じた損害について、当社は一切の責任を負いません。</p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold text-gray-900">第10条（規約の変更）</h2>
            <p>当社は必要に応じて本規約を変更することができます。変更後の規約は本サービス上に掲示した時点から効力を生じるものとし、ユーザーが変更後も本サービスを利用した場合、変更に同意したものとみなします。</p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold text-gray-900">第11条（準拠法・管轄裁判所）</h2>
            <p>本規約は日本法に準拠します。本サービスに関する紛争については、横浜地方裁判所を第一審の専属的合意管轄裁判所とします。</p>
          </section>

        </div>

        <p className="mt-8 text-xs text-gray-400">
          株式会社みずかげ製作所
        </p>
      </div>
    </div>
  );
}
