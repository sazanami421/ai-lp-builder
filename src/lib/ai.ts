import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MODEL = 'claude-sonnet-4-20250514';

/**
 * セクションデータを AI で生成・編集する
 */
export async function generateSectionContent(
  prompt: string,
  currentData: Record<string, unknown>
): Promise<Record<string, unknown>> {
  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: `現在のセクションデータ:\n${JSON.stringify(currentData, null, 2)}\n\n指示: ${prompt}\n\n変更後のセクションデータをJSONのみで返してください。`,
      },
    ],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('AI レスポンスから JSON を抽出できませんでした');
  return JSON.parse(jsonMatch[0]);
}
