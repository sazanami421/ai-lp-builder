import type {
  HeroSectionData,
  FeaturesSectionData,
  TestimonialsSectionData,
  PricingSectionData,
  FaqSectionData,
  CtaSectionData,
  FormSectionData,
  FooterSectionData,
  SectionType,
} from '@/types/section';

export const DEFAULT_SECTION_DATA: Record<SectionType, unknown> = {
  hero: {
    headline: 'あなたのビジネスを次のレベルへ',
    subheadline: 'AIが最適なLPを自動生成。数分で公開できます。',
    ctaText: '無料で始める',
    ctaUrl: '#',
  } satisfies HeroSectionData,

  features: {
    title: '選ばれる3つの理由',
    items: [
      { icon: '⚡', title: 'AI自動生成', description: 'チャットで指示するだけでLPが完成します。' },
      { icon: '✏️', title: '簡単編集', description: 'セクション単位でリアルタイムに編集できます。' },
      { icon: '🚀', title: 'すぐ公開', description: 'ワンクリックでホスティングして公開できます。' },
    ],
  } satisfies FeaturesSectionData,

  testimonials: {
    title: 'お客様の声',
    items: [
      { body: 'たった3分でプロ品質のLPが完成しました。信じられないほど簡単です。', name: '山田 太郎', role: '株式会社〇〇 代表' },
      { body: 'エンジニアなしでここまでできるとは思いませんでした。', name: '鈴木 花子', role: 'マーケティング担当' },
    ],
  } satisfies TestimonialsSectionData,

  pricing: {
    title: '料金プラン',
    plans: [
      { name: 'Free', price: '¥0', period: '月', features: ['LP 1件まで', 'AI生成 3回/月', '基本テンプレート'], ctaText: '無料で始める' },
      { name: 'Pro', price: '¥2,980', period: '月', features: ['LP 無制限', 'AI生成 無制限', '全テンプレート', 'カスタムドメイン'], highlighted: true, ctaText: 'Proを試す' },
    ],
  } satisfies PricingSectionData,

  faq: {
    title: 'よくある質問',
    items: [
      { question: 'クレジットカードなしで始められますか？', answer: 'はい、Freeプランはクレジットカード不要でご利用いただけます。' },
      { question: '途中でプランを変更できますか？', answer: 'いつでもアップグレード・ダウングレードが可能です。' },
    ],
  } satisfies FaqSectionData,

  cta: {
    headline: '今すぐ無料で始めましょう',
    subheadline: 'クレジットカード不要。セットアップは3分で完了します。',
    ctaText: '無料でアカウント作成',
    ctaUrl: '#',
  } satisfies CtaSectionData,

  form: {
    title: 'お問い合わせ',
    description: 'ご質問・ご相談はお気軽にどうぞ。',
    fields: [
      { name: 'name',    label: 'お名前',           type: 'text',     placeholder: '山田 太郎',              required: true  },
      { name: 'email',   label: 'メールアドレス',   type: 'email',    placeholder: 'example@mail.com',       required: true  },
      { name: 'message', label: 'メッセージ',       type: 'textarea', placeholder: 'お問い合わせ内容を入力', required: true  },
    ],
    submitText: '送信する',
    successMessage: 'お問い合わせありがとうございます。内容を確認のうえご連絡いたします。',
  } satisfies FormSectionData,

  footer: {
    copyright: `© ${new Date().getFullYear()} AI LP Builder. All rights reserved.`,
    links: [
      { label: '利用規約', url: '#' },
      { label: 'プライバシーポリシー', url: '#' },
    ],
  } satisfies FooterSectionData,
};
