'use client';

import { signOut } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';
import { PlanMenuSection, type PlanInfo } from '@/components/shared/PlanMenuSection';

type Props = {
  userName: string | null;
  userEmail: string | null;
  userImage: string | null;
  planInfo: PlanInfo;
};

export default function Header({ userName, userEmail, userImage, planInfo }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  const initials = userName
    ? userName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : userEmail?.[0]?.toUpperCase() ?? '?';

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* ロゴ */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-950">
            <span className="text-xs font-bold text-white">AI</span>
          </div>
          <span className="text-sm font-semibold tracking-tight text-gray-900">LP Builder</span>
        </Link>

        {/* ユーザーメニュー */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-full p-1 transition hover:bg-gray-100"
          >
            {userImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={userImage} alt={userName ?? ''} className="h-8 w-8 rounded-full object-cover" />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-600">
                {initials}
              </div>
            )}
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-10 z-20 w-64 rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
                <div className="border-b border-gray-100 px-4 py-3">
                  <p className="truncate text-sm font-medium text-gray-900">{userName ?? '—'}</p>
                  <p className="truncate text-xs text-gray-400">{userEmail}</p>
                </div>
                <PlanMenuSection planInfo={planInfo} />
                <div className="py-1">
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setMenuOpen(false)}
                    className="flex w-full items-center px-4 py-2.5 text-sm text-gray-700 transition hover:bg-gray-50"
                  >
                    アカウント設定
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className="flex w-full items-center px-4 py-2.5 text-sm text-gray-700 transition hover:bg-gray-50"
                  >
                    ログアウト
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
