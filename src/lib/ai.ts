import Anthropic from '@anthropic-ai/sdk';

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
  currentData: Record<string, unknown>,
  currentStyleOverrides: Record<string, string>
): Promise<SectionEditResult> {
  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 2048,
    system: [
      'あなたはLPのセクションを編集するアシスタントです。',
      'ユーザーの指示に従い、以下の形式のJSONのみを返してください。説明文・コードブロック記号は不要です。',
      '',
      '```',
      '{',
      '  "data": { /* コンテンツデータ（テキスト・項目など）*/ },',
      '  "styleOverrides": { /* CSSプロパティ（camelCase）例: "background", "padding", "borderRadius" */ }',
      '}',
      '```',
      '',
      '変更不要なフィールドは現在の値をそのまま返してください。',
      'styleOverrides にはセクション全体に適用したいCSSプロパティを入れてください。',
      '例: グラデーション背景 → { "background": "linear-gradient(135deg, #667eea, #764ba2)" }',
      '例: 上下余白変更 → { "paddingTop": "60px", "paddingBottom": "60px" }',
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
