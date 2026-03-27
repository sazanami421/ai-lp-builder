'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SiteThumbnail from './SiteThumbnail';

type Project = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  updatedAt: Date;
  pages: {
    isPublished: boolean;
    _count: { formSubmissions: number };
  }[];
};

type Props = {
  projects: Project[];
};

export default function ProjectList({ projects }: Props) {
  return (
    <div>
      {/* ページヘッダー */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">プロジェクト</h1>
          <p className="mt-1 text-sm text-gray-500">
            {projects.length > 0
              ? `${projects.length} 件のプロジェクト`
              : 'LPプロジェクトを作成して公開しましょう'}
          </p>
        </div>
        <Link
          href="/dashboard/new"
          className="rounded-lg bg-gray-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          + 新規作成
        </Link>
      </div>

      {projects.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white px-6 py-24 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
        <svg className="h-7 w-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        </svg>
      </div>
      <h2 className="text-base font-semibold text-gray-900">プロジェクトがありません</h2>
      <p className="mt-2 max-w-xs text-sm text-gray-500">
        最初のLPプロジェクトを作成しましょう。AIがあなたのビジネスに合ったLPを自動生成します。
      </p>
      <Link
        href="/dashboard/new"
        className="mt-6 rounded-lg bg-gray-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
      >
        + 最初のプロジェクトを作成
      </Link>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [nameValue, setNameValue] = useState(project.name);
  const [currentName, setCurrentName] = useState(project.name);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const renameInputRef = useRef<HTMLInputElement>(null);

  const updatedAt = new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(project.updatedAt));

  const submissionCount = project.pages.reduce(
    (sum, p) => sum + p._count.formSubmissions,
    0
  );
  const isPublished = project.pages.some((p) => p.isPublished);

  useEffect(() => {
    if (renaming) {
      renameInputRef.current?.focus();
      renameInputRef.current?.select();
    }
  }, [renaming]);

  async function handleRename() {
    const trimmed = nameValue.trim();
    if (!trimmed || trimmed === currentName) {
      setNameValue(currentName);
      setRenaming(false);
      return;
    }
    const res = await fetch(`/api/projects/${project.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: trimmed }),
    });
    if (res.ok) {
      setCurrentName(trimmed);
    } else {
      setNameValue(currentName);
    }
    setRenaming(false);
  }

  async function handleDelete() {
    setDeleting(true);
    const res = await fetch(`/api/projects/${project.id}`, { method: 'DELETE' });
    if (res.ok) {
      router.refresh();
    } else {
      setDeleting(false);
      setDeleteConfirm(false);
    }
  }

  return (
    <>
      <div className="group relative flex flex-col rounded-xl border border-gray-200 bg-white p-5 transition hover:border-gray-300 hover:shadow-sm">
        {/* サムネイル */}
        <div className="mb-4 h-28 overflow-hidden rounded-lg bg-gradient-to-br from-gray-100 to-gray-200">
          {isPublished && <SiteThumbnail slug={project.slug} />}
        </div>

        {/* プロジェクト情報 */}
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            {renaming ? (
              <input
                ref={renameInputRef}
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                onBlur={handleRename}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRename();
                  if (e.key === 'Escape') { setNameValue(currentName); setRenaming(false); }
                }}
                className="flex-1 rounded border border-blue-400 px-1.5 py-0.5 text-sm font-semibold text-gray-900 outline-none focus:ring-2 focus:ring-blue-300"
              />
            ) : (
              <h3 className="font-semibold text-gray-900 group-hover:text-gray-700">
                {currentName}
              </h3>
            )}

            {/* 3点メニュー */}
            <div className="relative shrink-0">
              <button
                onClick={(e) => { e.preventDefault(); setMenuOpen((v) => !v); }}
                className="flex h-6 w-6 items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 14a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" />
                </svg>
              </button>

              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-7 z-20 w-36 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                    <button
                      onClick={() => { setMenuOpen(false); setRenaming(true); setNameValue(currentName); }}
                      className="flex w-full items-center px-3 py-2 text-xs text-gray-700 transition hover:bg-gray-50"
                    >
                      名前を変更
                    </button>
                    <button
                      onClick={() => { setMenuOpen(false); setDeleteConfirm(true); }}
                      className="flex w-full items-center px-3 py-2 text-xs text-red-600 transition hover:bg-red-50"
                    >
                      削除
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {project.description && (
            <p className="mt-1 line-clamp-2 text-sm text-gray-500">{project.description}</p>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-gray-400">更新: {updatedAt}</span>
          <div className="flex items-center gap-2">
            {submissionCount > 0 && (
              <a
                href={`/dashboard/submissions/${project.id}`}
                className="flex items-center gap-1 rounded-md bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 transition hover:bg-blue-100"
              >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {submissionCount}件
              </a>
            )}
            <a
              href={`/editor/${project.id}`}
              className="rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-200"
            >
              編集
            </a>
          </div>
        </div>
      </div>

      {/* 削除確認ダイアログ */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-base font-semibold text-gray-900">プロジェクトを削除しますか？</h2>
            <p className="mt-2 text-sm text-gray-500">
              「{currentName}」を削除します。この操作は取り消せません。
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setDeleteConfirm(false)}
                disabled={deleting}
                className="rounded-lg px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-100 disabled:opacity-50"
              >
                キャンセル
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? '削除中…' : '削除する'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
