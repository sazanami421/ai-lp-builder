# AI LP Builder

AI パワードのLP制作SaaS。事業主・マーケター向け。

## プロジェクト概要

- **何をするサービスか**: チャット＋フォームでAIに指示→LPを自動生成→セクション単位でプレビューしながら編集→ホスティングして公開
- **ターゲット**: 事業主・マーケター（非エンジニア）
- **ビジネスモデル**: SaaS 月額課金、ホスティング込み

## 技術スタック

| レイヤー | 技術 |
|---------|------|
| フレームワーク | Next.js 14+ (App Router) |
| 言語 | TypeScript |
| スタイリング | Tailwind CSS |
| DB | Supabase (PostgreSQL) + Prisma ORM |
| 画像ストレージ | Supabase Storage |
| 認証 | NextAuth.js |
| AI | Anthropic Claude API (claude-sonnet-4-20250514) |
| ホスティング | Vercel |
| 決済 | Stripe（Phase 4で実装） |

## ディレクトリ構成（目標）

```
ai-lp-builder/
├── prisma/
│   └── schema.prisma          # DB スキーマ
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (auth)/            # 認証ページ（ログイン・登録）
│   │   ├── (dashboard)/       # ダッシュボード（プロジェクト一覧）
│   │   ├── editor/[pageId]/   # LP エディター
│   │   ├── api/               # API Routes
│   │   │   ├── ai/            # AI 生成・チャット
│   │   │   ├── sections/      # セクション CRUD
│   │   │   ├── pages/         # ページ CRUD
│   │   │   ├── upload/        # 画像アップロード
│   │   │   └── form/          # フォーム受信
│   │   └── p/[slug]/          # 公開 LP レンダリング
│   ├── components/
│   │   ├── editor/            # エディター UI コンポーネント
│   │   │   ├── SectionList.tsx
│   │   │   ├── EditPanel.tsx
│   │   │   ├── Preview.tsx
│   │   │   └── AIChatWindow.tsx
│   │   ├── sections/          # セクションレンダラー
│   │   │   ├── HeroSection.tsx
│   │   │   ├── FeaturesSection.tsx
│   │   │   ├── TestimonialsSection.tsx
│   │   │   ├── PricingSection.tsx
│   │   │   ├── FaqSection.tsx
│   │   │   ├── CtaSection.tsx
│   │   │   └── FooterSection.tsx
│   │   └── ui/                # 共通 UI コンポーネント
│   ├── lib/
│   │   ├── prisma.ts          # Prisma クライアント
│   │   ├── supabase.ts        # Supabase クライアント
│   │   ├── ai.ts              # Claude API ラッパー
│   │   └── templates/         # テンプレート CSS 変数定義
│   │       ├── simple.ts
│   │       ├── premium.ts
│   │       ├── pop.ts
│   │       └── business.ts
│   └── types/
│       └── section.ts         # セクション型定義（JSON スキーマ対応）
├── public/
├── docs/
│   ├── concept.docx           # プロダクト構想書
│   └── lp_schema.json         # セクション JSON スキーマ
├── templates/                 # テンプレート HTML 参考実装
│   ├── simple.html
│   ├── premium.html
│   ├── pop.html
│   └── business.html
├── CLAUDE.md                  # このファイル
├── .env.local                 # 環境変数（Git管理外）
└── package.json
```

## データベース（7テーブル）

- **users**: アカウント、プラン（free/pro/enterprise）
- **projects**: LP プロジェクト（slug で公開 URL 生成）
- **pages**: LP ページ（global_config に JSONB でテーマ設定）
- **sections**: セクションブロック（data に JSONB でコンテンツ、type で hero/features/testimonials/pricing/faq/cta/footer を識別）
- **section_history**: 変更履歴（data_before/data_after で Undo 実現、change_source で manual/ai_chat 識別）
- **form_submissions**: 公開 LP からのフォーム送信
- **assets**: ユーザーアップロード画像

詳細は `docs/concept.docx` セクション 5.2 参照。

## セクション JSON スキーマ

LP のデータは `global（テーマ）+ sections（ブロック配列）` の構造。各セクションは共通フィールド（id, type, order, visible, style_overrides）+ type 固有の data を持つ。

詳細スキーマは `docs/lp_schema.json` 参照。

## テンプレート（4種類）

| テンプレート | トーン | アクセント色 | フォント |
|------------|--------|------------|---------|
| simple | ミニマル | #2B2B28 | Outfit |
| premium | 高級感（ダーク） | #C6A96C | Cormorant Garamond |
| pop | カラフル | #FF6B35 | DM Sans |
| business | ビジネス（ブルー） | #1E56A0 | Plus Jakarta Sans |

HTML 参考実装は `templates/` ディレクトリ。CSS 変数でテーマを制御する設計。

## エディター UI

- **左パネル**: セクション一覧（ドラッグ並び替え）+ 選択中セクションの編集パネル（テキスト・色・画像）
- **右パネル**: リアルタイムプレビュー（セクションクリックで左パネル連動）
- **フローティングチャット**: 右下ボタンで開閉、選択中セクションに対してのみ指示
- **AI チャットフロー**: 指示入力 → AI が差分提案（テキスト: before/after、デザイン: ミニサムネイル2択）→「適用」ボタンで反映 → Undo 可能

## 開発フェーズ

1. **Phase 1**（1-2ヶ月）: 基盤（認証・DB・テンプレートエンジン・プレビュー画面）
2. **Phase 2**（2-4ヶ月）: AI 生成（フォーム＋チャット・セクション編集・画像アップロード）
3. **Phase 3**（4-5ヶ月）: 公開機能（ホスティング・フォーム受信・ドメイン設定）
4. **Phase 4**（5-6ヶ月）: 課金・ベータ（Stripe 統合・テスト・バグ修正）

## コーディング規約

- TypeScript strict mode
- コンポーネントは関数コンポーネント + hooks
- API Routes は Next.js App Router の Route Handlers
- DB アクセスは必ず Prisma 経由
- エラーハンドリングは try-catch + 適切な HTTP ステータスコード
- 日本語コメントOK、変数名は英語
