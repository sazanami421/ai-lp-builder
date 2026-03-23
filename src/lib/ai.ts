import Anthropic from '@anthropic-ai/sdk';
import { SECTION_VARIANTS } from '@/lib/variants';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MODEL = 'claude-sonnet-4-20250514';

export type SectionEditResult = {
  data: Record<string, unknown>;
  styleOverrides: Record<string, string>;
};

/**
 * セクションのコンテンツ・スタイルを AI で編集する
 */
export async function generateSectionEdit(
  prompt: string,
  sectionType: string,
  currentData: Record<string, unknown>,
  currentStyleOverrides: Record<string, string>
): Promise<SectionEditResult> {
  // セクション type の有効な variant 一覧を生成
  const variants = SECTION_VARIANTS[sectionType as keyof typeof SECTION_VARIANTS];
  const variantInfo = variants
    ? variants.map((v) => `"${v.value}" (${v.description})`).join(', ')
    : '';

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 2048,
    system: [
      'あなたはLPのセクションを編集するアシスタントです。',
      'ユーザーの指示に従い、以下の形式のJSONのみを返してください。説明文・コードブロック記号は不要です。',
      '',
      '{',
      '  "data": { /* コンテンツデータ（テキスト・項目など）*/ },',
      '  "styleOverrides": { /* CSSプロパティ（camelCase）例: "background", "padding", "borderRadius" */ }',
      '}',
      '',
      '変更不要なフィールドは現在の値をそのまま返してください。',
      '',
      '## variant（レイアウト）',
      `このセクション(${sectionType})で使用可能な variant: ${variantInfo}`,
      'ユーザーがレイアウト変更を指示した場合、data.variant フィールドを適切な値に変更してください。',
      '例: 「左右に分けて」→ variant を "split" に変更',
      '',
      '## styleOverrides',
      'セクション全体に適用したいCSSプロパティをcamelCaseで指定してください。',
      '例: グラデーション背景 → { "background": "linear-gradient(135deg, #667eea, #764ba2)" }',
      '例: 上下余白変更 → { "paddingTop": "60px", "paddingBottom": "60px" }',
      '例: テクスチャー無効化 → { "backgroundImage": "none" }',
    ].join('\n'),
    messages: [
      {
        role: 'user',
        content: [
          `セクションタイプ: ${sectionType}`,
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
