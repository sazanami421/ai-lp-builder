import Anthropic from '@anthropic-ai/sdk';
import { SectionType } from '@/types/section';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MODEL = 'claude-sonnet-4-20250514';

export type SectionEditResult = {
  data: Record<string, unknown>;
  styleOverrides: Record<string, string>;
};

// セクション種別ごとの利用可能 variant
const VARIANT_INFO: Record<SectionType, string> = {
  hero:         'centered（中央配置） | split（左テキスト＋右画像の2カラム）',
  features:     'grid（カードグリッド） | alternating（左右交互レイアウト）',
  testimonials: 'cards（カード並び） | single（1件を大きく表示）',
  pricing:      'cards（プランカード横並び）',
  faq:          'accordion（アコーディオン） | two-column（2カラムグリッド・全件展開）',
  cta:          'centered（中央配置） | banner（横長バナー・左テキスト＋右ボタン）',
  form:         'simple（フォームのみ中央） | split（左テキスト＋右フォームの2カラム）',
  footer:       'minimal（1行シンプル） | columns（複数カラム＋見出し付きリンク）',
};

/**
 * セクションのコンテンツ・スタイルを AI で編集する
 */
export async function generateSectionEdit(
  prompt: string,
  sectionType: SectionType,
  currentData: Record<string, unknown>,
  currentStyleOverrides: Record<string, string>
): Promise<SectionEditResult> {
  const variantInfo = VARIANT_INFO[sectionType];
  const currentVariant = typeof currentData.variant === 'string' ? currentData.variant : '（未指定）';

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 2048,
    system: [
      'あなたはLPのセクションを編集するアシスタントです。',
      'ユーザーの指示に従い、以下の形式のJSONのみを返してください。説明文・コードブロック記号は不要です。',
      '',
      '{',
      '  "data": { /* コンテンツデータ（テキスト・項目・variant など）*/ },',
      '  "styleOverrides": { /* CSSプロパティ（camelCase）*/ }',
      '}',
      '',
      '## variant（レイアウト）について',
      `編集中のセクション種別: ${sectionType}`,
      `現在の variant: ${currentVariant}`,
      `利用可能な variant: ${variantInfo}`,
      'レイアウトを変えたい場合は data.variant に上記の値をセットしてください。',
      'コンテンツの変更のみでレイアウト変更が不要なら variant は現在の値をそのまま返してください。',
      '',
      '## styleOverrides について',
      'セクション全体に適用したいCSSプロパティをcamelCaseで指定します。',
      '変更不要なら空オブジェクト {} を返してください。',
      '例: グラデーション背景 → { "background": "linear-gradient(135deg, #667eea, #764ba2)" }',
      '例: 上下余白変更 → { "paddingTop": "60px", "paddingBottom": "60px" }',
      '例: テクスチャー無効化 → { "backgroundImage": "none" }',
      '',
      '## 利用可能なCSSテーマ変数',
      '色・フォント・装飾には以下の変数が使えます（値はテンプレートで定義）:',
      '  --accent: メインアクセント色（ボタン・リンク等）',
      '  --accent-light: アクセントの薄い版（バッジ背景・ホバー等）',
      '  --bg: メイン背景色',
      '  --bg-secondary: セクション背景の交互色',
      '  --text: メイン文字色',
      '  --font-heading: 見出しフォント',
      '  --font-body: 本文フォント',
      '  --radius: 角丸サイズ',
      'CSS変数を使う場合は "backgroundColor": "var(--accent-light)" のように指定してください。',
      '',
      '変更不要なフィールドは現在の値をそのまま返してください。',
    ].join('\n'),
    messages: [
      {
        role: 'user',
        content: [
          `現在のコンテンツ:\n${JSON.stringify(currentData, null, 2)}`,
          `現在のスタイル上書き:\n${JSON.stringify(currentStyleOverrides, null, 2)}`,
          `指示: ${prompt}`,
        ].join('\n\n'),
      },
    ],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('AI レスポンスから JSON を抽出できませんでした');

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(jsonMatch[0]);
  } catch {
    throw new Error(
      `AI レスポンスの JSON パースに失敗しました: ${jsonMatch[0].slice(0, 200)}`
    );
  }

  return {
    data: (parsed.data as Record<string, unknown>) ?? currentData,
    styleOverrides: (parsed.styleOverrides as Record<string, string>) ?? currentStyleOverrides,
  };
}
