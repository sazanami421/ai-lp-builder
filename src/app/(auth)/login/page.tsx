import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton';
import LoginForm from '@/components/auth/LoginForm';

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect('/');

  return (
    <div className="flex min-h-screen">
      {/* 左パネル：ブランディング */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-gray-950 p-12 text-white">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
            <span className="text-sm font-bold text-gray-950">AI</span>
          </div>
          <span className="font-semibold tracking-tight">LP Builder</span>
        </div>

        <div>
          <blockquote className="space-y-4">
            <p className="text-2xl font-light leading-relaxed text-gray-100">
              AIに指示するだけで、<br />
              プロ品質のLPが<br />
              数分で完成します。
            </p>
            <footer className="text-sm text-gray-400">
              チャット＋フォームで指示 → セクション単位で編集 → そのまま公開
            </footer>
          </blockquote>
        </div>

        <div className="grid grid-cols-3 gap-6 text-center">
          {[
            { value: '3分', label: 'LP生成の平均時間' },
            { value: '4種', label: 'テンプレート' },
            { value: '無制限', label: 'セクション編集' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="mt-1 text-xs text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 右パネル：ログインフォーム */}
      <div className="flex w-full flex-col items-center justify-center px-6 lg:w-1/2">
        <div className="w-full max-w-sm">
          {/* モバイル用ロゴ */}
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-950">
              <span className="text-sm font-bold text-white">AI</span>
            </div>
            <span className="font-semibold tracking-tight">LP Builder</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              ログイン
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              アカウントをお持ちでない方は
              <a href="/register" className="font-medium text-gray-900 underline hover:no-underline">新規登録</a>
              へ。
            </p>
          </div>

          {/* Google ログイン */}
          <GoogleSignInButton />

          {/* 区切り線 */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-400">またはメールアドレスでログイン</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* メール+パスワード ログインフォーム */}
          <LoginForm />

          <p className="mt-6 text-center text-xs text-gray-400">
            ログインすることで
            <a href="#" className="underline hover:text-gray-600">利用規約</a>
            および
            <a href="#" className="underline hover:text-gray-600">プライバシーポリシー</a>
            に同意したものとみなします。
          </p>
        </div>
      </div>
    </div>
  );
}

