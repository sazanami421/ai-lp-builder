import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton';
import RegisterForm from '@/components/auth/RegisterForm';

export default async function RegisterPage() {
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

        <div className="space-y-8">
          <h2 className="text-3xl font-light leading-relaxed text-gray-100">
            無料で始めて、<br />
            すぐに成果を出す。
          </h2>
          <ul className="space-y-4 text-sm text-gray-400">
            {[
              'クレジットカード不要で今すぐ利用開始',
              'AIが事業内容を理解してLPを自動生成',
              'セクション単位でリアルタイム編集',
              'そのままホスティングして公開',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-0.5 text-green-400">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-gray-600">
          © 2026 AI LP Builder. All rights reserved.
        </p>
      </div>

      {/* 右パネル：登録フォーム */}
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
              アカウント作成
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              無料で始められます。クレジットカード不要。
            </p>
          </div>

          {/* Google 登録 */}
          <GoogleSignInButton />

          {/* 区切り線 */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-400">またはメールアドレスで登録</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* メール+パスワード登録フォーム */}
          <RegisterForm />

          <p className="mt-6 text-center text-xs text-gray-400">
            登録することで
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
