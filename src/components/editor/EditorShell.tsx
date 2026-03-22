'use client';

import { useState, useCallback, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import SectionList, { SectionItem } from './SectionList';
import EditPanel from './EditPanel';
import Preview from './Preview';
import AIChatWindow from './AIChatWindow';
import AddSectionModal from './AddSectionModal';
import { SectionType, GlobalConfig } from '@/types/section';
import { TEMPLATES } from '@/lib/templates';
import ThemePanel from './ThemePanel';

type Props = {
  project: { id: string; name: string; slug: string; submissionCount: number };
  page: { id: string; title: string; globalConfig: unknown; isPublished: boolean };
  initialSections: SectionItem[];
};

export default function EditorShell({ project, page, initialSections }: Props) {
  const { data: session } = useSession();
  const [sections, setSections] = useState<SectionItem[]>(initialSections);
  const [selectedId, setSelectedId] = useState<string | null>(
    initialSections[0]?.id ?? null
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addingSection, setAddingSection] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [chatOpen, setChatOpen] = useState(false);
  const [previewSuggestion, setPreviewSuggestion] = useState<{
    sectionId: string;
    data: unknown;
    styleOverrides: Record<string, string>;
  } | null>(null);

  const initialConfig = page.globalConfig as { template?: string; cssVars?: Record<string, string> } | null;
  const initialTemplate = (() => {
    const t = initialConfig?.template;
    return (t && t in TEMPLATES ? t : 'simple') as GlobalConfig['template'];
  })();
  const [template, setTemplate] = useState<GlobalConfig['template']>(initialTemplate);
  const [cssVars, setCssVars] = useState<Record<string, string>>(initialConfig?.cssVars ?? {});

  const saveGlobalConfig = useCallback((newTemplate: GlobalConfig['template'], newCssVars: Record<string, string>) => {
    fetch(`/api/pages/${page.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ globalConfig: { template: newTemplate, cssVars: newCssVars } }),
    });
  }, [page.id]);

  const handleTemplateChange = useCallback((newTemplate: GlobalConfig['template']) => {
    setTemplate(newTemplate);
    // テンプレート変更時はカスタムカラーをリセット
    setCssVars({});
    saveGlobalConfig(newTemplate, {});
  }, [saveGlobalConfig]);

  const handleCssVarsChange = useCallback((newCssVars: Record<string, string>) => {
    setCssVars(newCssVars);
    saveGlobalConfig(template, newCssVars);
  }, [template, saveGlobalConfig]);

  // debounce タイマーを sectionId ごとに管理
  const saveTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const selectedSection = sections.find((s) => s.id === selectedId) ?? null;

  // セクションデータを state 更新 + debounce 自動保存
  const updateSectionData = useCallback((sectionId: string, newData: unknown) => {
    setSections((prev) =>
      prev.map((s) => s.id === sectionId ? { ...s, data: newData } : s)
    );
    setSaveStatus('unsaved');

    if (saveTimers.current[sectionId]) {
      clearTimeout(saveTimers.current[sectionId]);
    }

    saveTimers.current[sectionId] = setTimeout(async () => {
      setSaveStatus('saving');
      try {
        await fetch(`/api/sections/${sectionId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: newData }),
        });
        setSaveStatus('saved');
      } catch {
        setSaveStatus('unsaved');
      }
    }, 1000);
  }, []);

  // AI の提案（data + styleOverrides）を即時適用して保存
  const applyAISuggestion = useCallback((sectionId: string, data: unknown, styleOverrides: Record<string, string>) => {
    setSections((prev) =>
      prev.map((s) => s.id === sectionId ? { ...s, data, styleOverrides } : s)
    );
    setSaveStatus('saving');
    fetch(`/api/sections/${sectionId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data, styleOverrides }),
    })
      .then((r) => setSaveStatus(r.ok ? 'saved' : 'unsaved'))
      .catch(() => setSaveStatus('unsaved'));
  }, []);

  const handleDelete = useCallback((sectionId: string) => {
    if (!window.confirm('このセクションを削除しますか？')) return;
    setSections((prev) => prev.filter((s) => s.id !== sectionId));
    setSelectedId((prev) => (prev === sectionId ? null : prev));
    fetch(`/api/sections/${sectionId}`, { method: 'DELETE' });
  }, []);

  const handleToggleVisible = useCallback((sectionId: string, visible: boolean) => {
    setSections((prev) =>
      prev.map((s) => s.id === sectionId ? { ...s, visible } : s)
    );
    fetch(`/api/sections/${sectionId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visible }),
    });
  }, []);

  const handleReorder = useCallback((newSections: SectionItem[]) => {
    setSections(newSections);
    setSaveStatus('saving');
    fetch('/api/sections/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orders: newSections.map((s) => ({ id: s.id, order: s.order })) }),
    })
      .then((r) => setSaveStatus(r.ok ? 'saved' : 'unsaved'))
      .catch(() => setSaveStatus('unsaved'));
  }, []);

  const handleAddSection = async (type: SectionType) => {
    setAddingSection(true);
    try {
      const res = await fetch('/api/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageId: page.id, type }),
      });
      const data = await res.json();
      if (!res.ok) {
        console.error('[handleAddSection] API error:', data);
        alert(`セクション追加に失敗しました: ${data.error ?? res.status}`);
        return;
      }

      const newSection: SectionItem = {
        id: data.section.id,
        type: data.section.type,
        order: data.section.order,
        visible: data.section.visible,
        data: data.section.data,
        styleOverrides: data.section.styleOverrides ?? {},
      };
      setSections((prev) => [...prev, newSection]);
      setSelectedId(newSection.id);
      setAddModalOpen(false);
    } finally {
      setAddingSection(false);
    }
  };

  const user = session?.user;
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? '?';

  return (
    <div className="flex h-screen flex-col bg-white">
      {/* トップバー */}
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-gray-200 px-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-1 text-xs text-gray-400 transition hover:text-gray-600"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            ダッシュボード
          </Link>
          <span className="text-gray-200">/</span>
          <span className="text-sm font-semibold text-gray-900">{project.name}</span>
          {project.submissionCount > 0 && (
            <Link
              href={`/dashboard/submissions/${project.id}`}
              className="flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600 transition hover:bg-blue-100"
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {project.submissionCount}
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* テンプレートセレクター */}
          <select
            value={template}
            onChange={(e) => handleTemplateChange(e.target.value as GlobalConfig['template'])}
            className="rounded-lg border border-gray-200 px-2 py-1 text-xs text-gray-700 outline-none transition focus:border-blue-400"
          >
            {(Object.keys(TEMPLATES) as GlobalConfig['template'][]).map((key) => (
              <option key={key} value={key}>{TEMPLATES[key].label}</option>
            ))}
          </select>

          {/* 保存ステータス */}
          <span className={`text-xs transition ${
            saveStatus === 'saved'   ? 'text-gray-400' :
            saveStatus === 'saving'  ? 'text-blue-400' :
                                       'text-amber-500'
          }`}>
            {saveStatus === 'saved'  ? '保存済み' :
             saveStatus === 'saving' ? '保存中…'  : '未保存'}
          </span>

          {/* アカウントメニュー */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 rounded-full p-1 transition hover:bg-gray-100"
            >
              {user?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.image} alt={user.name ?? ''} className="h-7 w-7 rounded-full object-cover" />
              ) : (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-600">
                  {initials}
                </div>
              )}
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-9 z-20 w-48 rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
                  <div className="border-b border-gray-100 px-4 py-2.5">
                    <p className="truncate text-xs font-medium text-gray-900">{user?.name ?? '—'}</p>
                    <p className="truncate text-xs text-gray-400">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className="flex w-full items-center px-4 py-2 text-xs text-gray-700 transition hover:bg-gray-50"
                  >
                    ログアウト
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* メイン */}
      <div className="flex flex-1 overflow-hidden">
        <aside className="flex w-64 shrink-0 flex-col border-r border-gray-200 bg-white">
          <ThemePanel
            template={template}
            cssVars={cssVars}
            onChange={handleCssVarsChange}
          />
          <SectionList
            sections={sections}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onAddClick={() => setAddModalOpen(true)}
            onReorder={handleReorder}
            onToggleVisible={handleToggleVisible}
            onDelete={handleDelete}
          />
        </aside>
        <aside className="flex w-80 shrink-0 flex-col border-r border-gray-200 bg-white">
          <EditPanel
            section={selectedSection}
            onUpdate={(newData) => selectedSection && updateSectionData(selectedSection.id, newData)}
          />
        </aside>

        <div className="relative flex flex-1 flex-col overflow-hidden">
          <Preview
            sections={sections}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onAIClick={(sectionId) => {
              setSelectedId(sectionId);
              setChatOpen(true);
            }}
            previewSuggestion={previewSuggestion}
            projectName={project.name}
            template={template}
            cssVars={cssVars}
            pageId={page.id}
            projectSlug={project.slug}
            initialIsPublished={page.isPublished}
          />
          <AIChatWindow
            selectedSection={selectedSection}
            onApply={(sectionId, data, styleOverrides) => {
              applyAISuggestion(sectionId, data, styleOverrides);
              setPreviewSuggestion(null);
            }}
            onPreview={(sectionId, data, styleOverrides) =>
              setPreviewSuggestion({ sectionId, data, styleOverrides })
            }
            onClearPreview={() => setPreviewSuggestion(null)}
            open={chatOpen}
            onOpenChange={setChatOpen}
          />
        </div>
      </div>

      {addModalOpen && (
        <AddSectionModal
          onSelect={handleAddSection}
          onClose={() => setAddModalOpen(false)}
          loading={addingSection}
        />
      )}
    </div>
  );
}
