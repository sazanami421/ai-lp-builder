'use client';

import { signOut } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';

type Props = {
  userName: string | null;
  userEmail: string | null;
  userImage: string | null;
};

export default function Header({ userName, userEmail, userImage }: Props) {
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
              {/* オーバーレイ */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />
              {/* ドロップダウン */}
              <div className="absolute right-0 top-10 z-20 w-56 rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
                <div className="border-b border-gray-100 px-4 py-3">
                  <p className="text-sm font-medium text-gray-900 truncate">{userName ?? '—'}</p>
                  <p className="text-xs text-gray-400 truncate">{userEmail}</p>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-gray-700 transition hover:bg-gray-50"
                >
                  ログアウト
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
