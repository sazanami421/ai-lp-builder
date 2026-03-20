# AI LP Builder - セットアップ & 引き継ぎガイド

## 開発を始める前の準備チェックリスト

### 1. GitHubリポジトリ作成

```bash
# GitHubで新規リポジトリを作成（Private推奨）
# リポジトリ名: ai-lp-builder

# ローカルにクローン
git clone https://github.com/YOUR_USERNAME/ai-lp-builder.git
cd ai-lp-builder
```

### 2. 外部サービスのアカウント作成

以下のサービスは全て無料枠で開始できます。

| サービス | URL | 取得するもの | 備考 |
|---------|-----|------------|------|
| Vercel | https://vercel.com | アカウント | GitHubログインで作成、デプロイ先 |
| Supabase | https://supabase.com | プロジェクト | 「New Project」で作成、DB+Storage |
| Anthropic | https://console.anthropic.com | APIキー | Claude API用 |
| Stripe | https://stripe.com | アカウント | Phase 4で使用、後回しでOK |

### 3. Supabaseプロジェクト作成手順

1. https://supabase.com でサインアップ
2. 「New Project」をクリック
3. プロジェクト名: `ai-lp-builder`
4. データベースパスワードを設定（メモしておく）
5. リージョン: `Northeast Asia (Tokyo)` を選択
6. 作成後、Settings > API から以下をメモ:
   - `Project URL` → NEXT_PUBLIC_SUPABASE_URL
   - `anon public` キー → NEXT_PUBLIC_SUPABASE_ANON_KEY
   - `service_role` キー → SUPABASE_SERVICE_ROLE_KEY
7. Settings > Database から:
   - `Connection string (URI)` → DATABASE_URL

### 4. 環境変数ファイル

リポジトリのルートに `.env.local` を作成（.gitignoreに含めること）:

```env
# Database (Supabase)
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Auth (NextAuth.js)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="openssl-rand-base64-32-で生成した値"

# AI (Claude API)
ANTHROPIC_API_KEY="sk-ant-api03-..."

# Stripe (Phase 4で設定)
# STRIPE_SECRET_KEY=""
# STRIPE_PUBLISHABLE_KEY=""
# STRIPE_WEBHOOK_SECRET=""
```

### 5. Claude Codeでの開発開始

```bash
# リポジトリに移動
cd ai-lp-builder

# CLAUDE.mdを配置（このファイルと一緒に提供済み）
# → Claude Codeがプロジェクトの全体像を理解する

# Claude Codeを起動
claude

# 最初の指示例:
# 「CLAUDE.mdを読んで、Phase 1の基盤構築を始めてください。
#   まずNext.jsプロジェクトの初期化、Prismaスキーマの作成、
#   認証の実装をお願いします。」
```

## Claude Codeへの効果的な指示の出し方

### Phase 1で最初に頼むこと（順番に）

```
1. 「Next.jsプロジェクトをTypeScript + Tailwind CSSで初期化してください」

2. 「CLAUDE.mdのディレクトリ構成に従ってフォルダを作成してください」

3. 「docs/lp_schema.jsonを参考に、prisma/schema.prismaでDB設計の
    7テーブルを定義してください」

4. 「NextAuth.jsでメール+パスワード認証を実装してください。
    ログインページとユーザー登録ページも作ってください」

5. 「ダッシュボード画面を作ってください。
    プロジェクト一覧と新規プロジェクト作成ボタンがあるページです」

6. 「エディター画面の骨格を作ってください。
    左にセクション一覧+編集パネル、右にプレビューの2カラムレイアウトです」
```

### 指示のコツ

- **一度に1つの機能**を頼む（まとめて頼むと品質が下がる）
- **CLAUDE.mdを参照させる**（「CLAUDE.mdの〇〇セクションを参考に」）
- **既存ファイルを指定する**（「src/components/editor/にPreview.tsxを作って」）
- **動作確認してからコミット**を頼む（「動作確認してgit commitしてください」）

## 提供済み成果物一覧

| ファイル | 内容 | 用途 |
|---------|------|------|
| CLAUDE.md | プロジェクト指示書 | リポジトリのルートに配置 |
| ai_lp_builder_concept_v7.docx | プロダクト構想書 | docs/に配置、参照用 |
| lp_schema.json | セクションJSONスキーマ | docs/に配置、型定義の元 |
| template_simple.html | シンプルテンプレート | templates/に配置、参考実装 |
| template_premium.html | 高級感テンプレート | templates/に配置、参考実装 |
| template_pop.html | ポップテンプレート | templates/に配置、参考実装 |
| template_business.html | ビジネステンプレート | templates/に配置、参考実装 |

## リポジトリの初期配置

```
ai-lp-builder/
├── CLAUDE.md              ← 提供済み
├── docs/
│   ├── concept.docx       ← 提供済み（リネーム）
│   └── lp_schema.json     ← 提供済み
├── templates/
│   ├── simple.html        ← 提供済み
│   ├── premium.html       ← 提供済み
│   ├── pop.html           ← 提供済み
│   └── business.html      ← 提供済み
├── .gitignore             ← Claude Codeに作ってもらう
├── .env.local             ← 手動作成（Git管理外）
└── README.md              ← Claude Codeに作ってもらう
```

## よくある質問

**Q: Vercelの無料枠で足りる？**
→ MVPなら十分。Hobby プランで月100GBの帯域、Serverless Functions対応。

**Q: Supabaseの無料枠の制限は？**
→ 500MB DB、1GB Storage、50,000 月間アクティブユーザー。MVPには十分。

**Q: 自社サーバーへの移行はいつ？**
→ 月間アクセスがVercel/Supabase無料枠を超えたタイミング。
→ Next.jsのスタンドアロンビルド + PostgreSQL直接接続に切り替えるだけ。

**Q: ドメインの設定は？**
→ Phase 3で対応。VercelにカスタムドメインをDNS設定するだけ。
