import Anthropic from '@anthropic-ai/sdk';
import { SectionType } from '@/types/section';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MODEL = 'claude-sonnet-4-20250514';

export type GenerateLPInput = {
  projectName: string;
  industry: string;
  target: string;
  usp: string;
  features: string[];
  pricingCount: number; // 0-3
  ctaGoal: string;
};

export type GeneratedSectionData = {
  type: SectionType;
  data: Record<string, unknown>;
};

export type SectionEditResult = {
  data: Record<string, unknown>;
  styleOverrides: Record<string, string>;
};

// セクション種別ごとの利用可能 variant
const VARIANT_INFO: Record<SectionType, string> = {
  hero:          'centered（中央配置） | split（左テキスト＋右画像の2カラム）',
  features:      'grid（カードグリッド） | alternating（左右交互レイアウト）',
  testimonials:  'cards（カード並び） | single（1件を大きく表示）',
  pricing:       'cards（プランカード横並び）',
  pricing_table: 'simple（テーブル形式の機能比較）',
  faq:           'accordion（アコーディオン） | two-column（2カラムグリッド・全件展開）',
  cta:           'centered（中央配置） | banner（横長バナー・左テキスト＋右ボタン）',
  steps:         'horizontal（横並び） | vertical（縦タイムライン）',
  stats:         'row（横一列） | cards（カード形式）',
  logo_bar:      'static（静的グリッド） | scroll（横スクロール）',
  gallery:       'grid（均等グリッド） | masonry（メイソンリー）',
  divider:       'gradient（グラデーション帯） | ornament（装飾ライン）',
  form:          'simple（フォームのみ中央） | split（左テキスト＋右フォームの2カラム）',
  footer:        'minimal（1行シンプル） | columns（複数カラム＋見出し付きリンク）',
};

/**
 * ヒアリング情報を元に全セクションのコンテンツを一括生成する
 */
export async function generateLP(input: GenerateLPInput): Promise<GeneratedSectionData[]> {
  const includePricing = input.pricingCount > 0;

  const pricingSchema = includePricing ? `
  "pricing": {
    "title": "料金プラン",
    "plans": [
      {
        "name": "プラン名",
        "price": "¥X,XXX",
        "period": "月",
        "features": ["特徴1", "特徴2", "特徴3"],
        "ctaText": "ボタンテキスト",
        "highlighted": false
      }
      // pricingCount の数だけ生成
    ]
  },` : '';

  const systemPrompt = [
    'あなたはLPのコンテンツライターです。',
    '以下のビジネス情報をもとに、各セクションの日本語コンテンツを生成してください。',
    'JSONのみを返してください。説明文・コードブロック記号（```）は不要です。',
    '',
    '## 出力フォーマット',
    '{',
    '  "hero": {',
    '    "headline": "キャッチコピー（20字前後）",',
    '    "subheadline": "サブ見出し（40-60字）",',
    '    "ctaText": "CTAボタンのテキスト",',
    '    "ctaUrl": "#"',
    '  },',
    '  "features": {',
    '    "title": "セクション見出し",',
    '    "items": [',
    '      { "icon": "アイコン名", "title": "特徴タイトル", "description": "説明文（30-50字）" }',
    '      // features の数だけ生成（最大3件）',
    '    ]',
    '  },',
    '  "testimonials": {',
    '    "title": "お客様の声",',
    '    "items": [',
    '      { "body": "利用者の感想（40-80字）", "name": "氏名", "role": "職種・会社" },',
    '      { "body": "利用者の感想（40-80字）", "name": "氏名", "role": "職種・会社" }',
    '    ]',
    '  },',
    pricingSchema,
    '  "steps": {',
    '    "title": "ご利用の流れ",',
    '    "items": [',
    '      { "icon": "アイコン名", "title": "ステップタイトル", "description": "説明文（20-40字）" },',
    '      { "icon": "アイコン名", "title": "ステップタイトル", "description": "説明文（20-40字）" },',
    '      { "icon": "アイコン名", "title": "ステップタイトル", "description": "説明文（20-40字）" }',
    '    ]',
    '  },',
    '  "faq": {',
    '    "title": "よくある質問",',
    '    "items": [',
    '      { "question": "質問文", "answer": "回答文（40-80字）" },',
    '      { "question": "質問文", "answer": "回答文（40-80字）" },',
    '      { "question": "質問文", "answer": "回答文（40-80字）" }',
    '    ]',
    '  },',
    '  "cta": {',
    '    "headline": "行動を促すコピー",',
    '    "subheadline": "補足テキスト",',
    '    "ctaText": "CTAボタンのテキスト",',
    '    "ctaUrl": "#"',
    '  },',
    '  "form": {',
    '    "title": "フォームタイトル",',
    '    "description": "フォームの説明文",',
    '    "fields": [',
    '      { "name": "name",    "label": "お名前",         "type": "text",     "placeholder": "山田 太郎",        "required": true },',
    '      { "name": "email",   "label": "メールアドレス", "type": "email",    "placeholder": "example@mail.com", "required": true },',
    '      { "name": "message", "label": "メッセージ",     "type": "textarea", "placeholder": "お問い合わせ内容", "required": true }',
    '    ],',
    '    "submitText": "送信する",',
    '    "successMessage": "送信完了メッセージ"',
    '  },',
    '  "footer": {',
    `    "copyright": "© ${new Date().getFullYear()} ${input.projectName}. All rights reserved.",`,
    '    "links": [',
    '      { "label": "利用規約", "url": "#" },',
    '      { "label": "プライバシーポリシー", "url": "#" }',
    '    ]',
    '  }',
    '}',
    '',
    '## 注意事項',
    '- 全て日本語で生成してください',
    '- testimonials は実在しない架空のユーザー情報で問題ありません',
    '- ctaUrl はすべて "#" にしてください',
    '- hero の headline は短くキャッチーに（20字前後）',
    '- features と steps の "icon" は以下の30個から選んで名前で指定してください（絵文字は使わない）:',
    '  zap (高速・パワー), rocket (起動・スタート), shield (セキュリティ), gem (プレミアム),',
    '  sparkles (新機能), bar-chart (分析・データ), target (目標), japanese-yen (料金),',
    '  smartphone (モバイル), star (評価), heart (好き), lock (セキュリティ),',
    '  check-circle (完了), users (チーム), clock (時間), trending-up (成長),',
    '  globe (グローバル), message-circle (チャット), mail (メール), settings (設定),',
    '  search (検索), bell (通知), calendar (予定), book-open (学習),',
    '  award (実績), gift (特典), lightbulb (アイデア), thumbs-up (いいね),',
    '  briefcase (ビジネス), headphones (サポート)',
    '  適切なアイコンがない場合は "icon" を空文字 "" にしてください',
  ].join('\n');

  const userMessage = [
    `サービス名: ${input.projectName}`,
    `業種: ${input.industry}`,
    `ターゲット: ${input.target}`,
    `強み: ${input.usp}`,
    `主な機能・特徴: ${input.features.join('、')}`,
    `料金プラン数: ${input.pricingCount === 0 ? 'なし' : `${input.pricingCount}プラン`}`,
    `CTAのゴール: ${input.ctaGoal}`,
  ].join('\n');

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('AI レスポンスから JSON を抽出できませんでした');

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(jsonMatch[0]);
  } catch {
    throw new Error(`AI レスポンスの JSON パースに失敗しました: ${jsonMatch[0].slice(0, 200)}`);
  }

  const sectionTypes: SectionType[] = [
    'hero', 'features', 'testimonials',
    ...(includePricing ? ['pricing' as SectionType] : []),
    'steps', 'faq', 'cta', 'form', 'footer',
  ];

  return sectionTypes
    .filter((type) => parsed[type] != null)
    .map((type) => ({
      type,
      data: parsed[type] as Record<string, unknown>,
    }));
}

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
      '',
      ...(sectionType === 'features' || sectionType === 'steps' ? [
        '## アイコンについて',
        '"icon" フィールドには以下の30個から名前で指定してください（絵文字は使わない）:',
        '  zap (高速・パワー), rocket (起動・スタート), shield (セキュリティ), gem (プレミアム),',
        '  sparkles (新機能), bar-chart (分析・データ), target (目標), japanese-yen (料金),',
        '  smartphone (モバイル), star (評価), heart (好き), lock (セキュリティ),',
        '  check-circle (完了), users (チーム), clock (時間), trending-up (成長),',
        '  globe (グローバル), message-circle (チャット), mail (メール), settings (設定),',
        '  search (検索), bell (通知), calendar (予定), book-open (学習),',
        '  award (実績), gift (特典), lightbulb (アイデア), thumbs-up (いいね),',
        '  briefcase (ビジネス), headphones (サポート)',
        '  適切なアイコンがない場合は "icon" を空文字 "" にしてください',
      ] : []),
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
