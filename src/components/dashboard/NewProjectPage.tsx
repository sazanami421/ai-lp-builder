'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// カラートーン → テンプレートマッピング
const COLOR_TONE_TO_TEMPLATE: Record<string, string> = {
  minimal:  'simple',
  blue:     'business',
  green:    'natural',
  orange:   'pop',
  dark:     'premium',
};

const TEMPLATES = [
  { value: 'simple',   label: 'シンプル',   accent: '#2B2B28', bg: '#FFFFFF', desc: 'ミニマル・モノトーン' },
  { value: 'business', label: 'ビジネス',   accent: '#1E56A0', bg: '#FFFFFF', desc: 'プロフェッショナル・信頼感' },
  { value: 'natural',  label: 'ナチュラル', accent: '#2D8A6E', bg: '#FAFAF7', desc: '自然・健康・ウェルネス' },
  { value: 'pop',      label: 'ポップ',     accent: '#FF6B35', bg: '#FFFBF5', desc: 'カラフル・親しみやすい' },
  { value: 'premium',  label: 'プレミアム', accent: '#C6A96C', bg: '#0F0F0F', desc: '高級感・ダーク' },
];

type Mode = 'select' | 'manual' | 'ai-full' | 'ai-template';

type HearingAnswers = {
  industry: string;
  target: string;
  usp: string;
  feature1: string;
  feature2: string;
  feature3: string;
  pricingCount: string;
  ctaGoal: string;
  colorTone: string;   // ai-full のみ使用
  template: string;    // ai-template のみ使用
  projectName: string;
};

const EMPTY_ANSWERS: HearingAnswers = {
  industry: '', target: '', usp: '',
  feature1: '', feature2: '', feature3: '',
  pricingCount: '', ctaGoal: '',
  colorTone: '', template: '',
  projectName: '',
};

export default function NewProjectPage() {
  const [mode, setMode] = useState<Mode>('select');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<HearingAnswers>(EMPTY_ANSWERS);
  const [generating, setGenerating] = useState(false);
  const router = useRouter();

  const startAI = (m: 'ai-full' | 'ai-template') => {
    setAnswers(EMPTY_ANSWERS);
    setStep(m === 'ai-template' ? 0 : 1);
    setMode(m);
  };

  const goBack = () => {
    if (step <= (mode === 'ai-template' ? 0 : 1)) {
      setMode('select');
    } else {
      setStep((s) => s - 1);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    const template = mode === 'ai-full'
      ? COLOR_TONE_TO_TEMPLATE[answers.colorTone] ?? 'simple'
      : answers.template;

    const res = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectName: answers.projectName,
        template,
        industry: answers.industry,
        target: answers.target,
        usp: answers.usp,
        features: [answers.feature1, answers.feature2, answers.feature3].filter(Boolean),
        pricingCount: answers.pricingCount,
        ctaGoal: answers.ctaGoal,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      router.push(`/editor/${data.pageId}`);
    } else {
      setGenerating(false);
      alert('生成に失敗しました。もう一度お試しください。');
    }
  };

  if (mode === 'manual') {
    return <ManualForm onBack={() => setMode('select')} />;
  }

  if (mode === 'select') {
    return <ModeSelect onSelectAI={startAI} onSelectManual={() => setMode('manual')} />;
  }

  if (generating) {
    return <GeneratingScreen />;
  }

  // AI フロー
  const totalSteps = mode === 'ai-template' ? 5 : 4;
  const currentStep = mode === 'ai-template' ? step + 1 : step;

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      {/* ヘッダー */}
      <div className="mb-8">
        <button
          onClick={goBack}
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-400 transition hover:text-gray-600"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          戻る
        </button>
        <h1 className="text-xl font-bold text-gray-900">
          {mode === 'ai-full' ? 'AIにおまかせ' : 'テンプレート＋AI生成'}
        </h1>
        {/* プログレスバー */}
        <div className="mt-4 flex items-center gap-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className="h-1.5 flex-1 rounded-full transition-colors"
              style={{ backgroundColor: i < currentStep ? '#111827' : '#E5E7EB' }}
            />
          ))}
          <span className="ml-1 shrink-0 text-xs text-gray-400">{currentStep}/{totalSteps}</span>
        </div>
      </div>

      {/* ステップ内容 */}
      {mode === 'ai-template' && step === 0 && (
        <TemplateStep
          value={answers.template}
          onChange={(v) => setAnswers((a) => ({ ...a, template: v }))}
          onNext={() => setStep(1)}
        />
      )}
      {step === 1 && (
        <Step1
          answers={answers}
          onChange={(k, v) => setAnswers((a) => ({ ...a, [k]: v }))}
          onNext={() => setStep(2)}
        />
      )}
      {step === 2 && (
        <Step2
          answers={answers}
          onChange={(k, v) => setAnswers((a) => ({ ...a, [k]: v }))}
          onNext={() => setStep(3)}
        />
      )}
      {step === 3 && (
        <Step3
          answers={answers}
          showColorTone={mode === 'ai-full'}
          onChange={(k, v) => setAnswers((a) => ({ ...a, [k]: v }))}
          onNext={() => setStep(4)}
        />
      )}
      {step === 4 && (
        <Step4
          answers={answers}
          onChange={(k, v) => setAnswers((a) => ({ ...a, [k]: v }))}
          onGenerate={handleGenerate}
        />
      )}
    </div>
  );
}

// --- 共通UIパーツ ---

function SelectCard({
  selected, onClick, children,
}: {
  selected: boolean; onClick: () => void; children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-xl border px-4 py-3 text-left text-sm transition"
      style={{
        borderColor: selected ? '#111827' : '#E5E7EB',
        backgroundColor: selected ? '#F9FAFB' : '#FFFFFF',
        fontWeight: selected ? 600 : 400,
        color: '#111827',
      }}
    >
      {children}
    </button>
  );
}

function NextButton({ disabled, onClick, label = '次へ' }: { disabled?: boolean; onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="mt-6 w-full rounded-lg bg-gray-950 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-40"
    >
      {label}
    </button>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <p className="mb-2 text-sm font-medium text-gray-700">{children}</p>;
}

// --- テンプレート選択（② のみ） ---

function TemplateStep({
  value, onChange, onNext,
}: {
  value: string; onChange: (v: string) => void; onNext: () => void;
}) {
  return (
    <div>
      <p className="mb-1 text-base font-semibold text-gray-900">テンプレートを選択</p>
      <p className="mb-5 text-sm text-gray-500">デザインの雰囲気を選んでください。コンテンツはAIが生成します。</p>
      <div className="space-y-2">
        {TEMPLATES.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => onChange(t.value)}
            className="flex w-full items-center gap-4 rounded-xl border px-4 py-3 text-left transition"
            style={{
              borderColor: value === t.value ? '#111827' : '#E5E7EB',
              backgroundColor: value === t.value ? '#F9FAFB' : '#FFFFFF',
            }}
          >
            {/* カラープレビュー */}
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: t.bg, border: '1px solid #E5E7EB' }}
            >
              <div className="h-5 w-5 rounded-full" style={{ backgroundColor: t.accent }} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{t.label}</p>
              <p className="text-xs text-gray-500">{t.desc}</p>
            </div>
          </button>
        ))}
      </div>
      <NextButton disabled={!value} onClick={onNext} />
    </div>
  );
}

// --- Step 1: 業種・ターゲット ---

const INDUSTRIES = [
  { value: 'saas',    label: 'SaaS・ソフトウェア' },
  { value: 'ec',      label: 'EC・物販' },
  { value: 'law',     label: '士業・コンサル' },
  { value: 'food',    label: '飲食・カフェ' },
  { value: 'health',  label: '医療・美容・健康' },
  { value: 'other',   label: 'その他' },
];

const TARGETS = [
  { value: 'personal', label: '個人向け' },
  { value: 'smb',      label: '中小企業向け' },
  { value: 'enterprise', label: '大企業向け' },
  { value: 'broad',    label: '幅広く' },
];

function Step1({
  answers, onChange, onNext,
}: {
  answers: HearingAnswers;
  onChange: (k: keyof HearingAnswers, v: string) => void;
  onNext: () => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <FieldLabel>業種・カテゴリ</FieldLabel>
        <div className="grid grid-cols-2 gap-2">
          {INDUSTRIES.map((o) => (
            <SelectCard
              key={o.value}

              selected={answers.industry === o.value}
              onClick={() => onChange('industry', o.value)}
            >
              {o.label}
            </SelectCard>
          ))}
        </div>
      </div>

      <div>
        <FieldLabel>ターゲット</FieldLabel>
        <div className="grid grid-cols-2 gap-2">
          {TARGETS.map((o) => (
            <SelectCard
              key={o.value}

              selected={answers.target === o.value}
              onClick={() => onChange('target', o.value)}
            >
              {o.label}
            </SelectCard>
          ))}
        </div>
      </div>

      <NextButton
        disabled={!answers.industry || !answers.target}
        onClick={onNext}
      />
    </div>
  );
}

// --- Step 2: 強み・機能 ---

function Step2({
  answers, onChange, onNext,
}: {
  answers: HearingAnswers;
  onChange: (k: keyof HearingAnswers, v: string) => void;
  onNext: () => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <FieldLabel>一番の強み</FieldLabel>
        <textarea
          rows={3}
          placeholder="例：AIを使って10分でLPを自動生成できる"
          value={answers.usp}
          onChange={(e) => onChange('usp', e.target.value)}
          className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
        />
      </div>

      <div>
        <FieldLabel>主な特徴・機能（3つ）</FieldLabel>
        <div className="space-y-2">
          {(['feature1', 'feature2', 'feature3'] as const).map((key, i) => (
            <input
              key={key}
              type="text"
              placeholder={`特徴・機能 ${i + 1}`}
              value={answers[key]}
              onChange={(e) => onChange(key, e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
            />
          ))}
        </div>
      </div>

      <NextButton
        disabled={!answers.usp || !answers.feature1}
        onClick={onNext}
      />
    </div>
  );
}

// --- Step 3: 料金・CTA・カラートーン ---

const PRICING_OPTIONS = [
  { value: '0', label: 'なし' },
  { value: '1', label: '1プラン' },
  { value: '2', label: '2プラン' },
  { value: '3', label: '3プラン' },
];

const CTA_GOALS = [
  { value: 'register', label: '無料登録' },
  { value: 'document', label: '資料請求' },
  { value: 'purchase', label: '購入' },
  { value: 'contact',  label: 'お問い合わせ' },
];

const COLOR_TONES = [
  { value: 'minimal', label: 'ミニマル', desc: '白・黒・グレー', color: '#2B2B28' },
  { value: 'blue',    label: 'ブルー',   desc: 'ビジネス・信頼感', color: '#1E56A0' },
  { value: 'green',   label: 'グリーン', desc: 'ナチュラル・健康', color: '#2D8A6E' },
  { value: 'orange',  label: 'オレンジ', desc: 'ポップ・親しみやすい', color: '#FF6B35' },
  { value: 'dark',    label: 'ダーク',   desc: '高級感', color: '#C6A96C' },
];

function Step3({
  answers, showColorTone, onChange, onNext,
}: {
  answers: HearingAnswers;
  showColorTone: boolean;
  onChange: (k: keyof HearingAnswers, v: string) => void;
  onNext: () => void;
}) {
  const canNext = answers.pricingCount !== '' && answers.ctaGoal !== ''
    && (!showColorTone || answers.colorTone !== '');

  return (
    <div className="space-y-6">
      <div>
        <FieldLabel>料金プランの数</FieldLabel>
        <div className="grid grid-cols-4 gap-2">
          {PRICING_OPTIONS.map((o) => (
            <SelectCard
              key={o.value}

              selected={answers.pricingCount === o.value}
              onClick={() => onChange('pricingCount', o.value)}
            >
              {o.label}
            </SelectCard>
          ))}
        </div>
      </div>

      <div>
        <FieldLabel>CTAのゴール</FieldLabel>
        <div className="grid grid-cols-2 gap-2">
          {CTA_GOALS.map((o) => (
            <SelectCard
              key={o.value}

              selected={answers.ctaGoal === o.value}
              onClick={() => onChange('ctaGoal', o.value)}
            >
              {o.label}
            </SelectCard>
          ))}
        </div>
      </div>

      {showColorTone && (
        <div>
          <FieldLabel>カラートーン</FieldLabel>
          <div className="space-y-2">
            {COLOR_TONES.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => onChange('colorTone', o.value)}
                className="flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition"
                style={{
                  borderColor: answers.colorTone === o.value ? '#111827' : '#E5E7EB',
                  backgroundColor: answers.colorTone === o.value ? '#F9FAFB' : '#FFFFFF',
                }}
              >
                <div className="h-5 w-5 shrink-0 rounded-full" style={{ backgroundColor: o.color }} />
                <div>
                  <span className="text-sm font-medium text-gray-900">{o.label}</span>
                  <span className="ml-2 text-xs text-gray-500">{o.desc}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <NextButton disabled={!canNext} onClick={onNext} />
    </div>
  );
}

// --- Step 4: プロジェクト名 ---

function Step4({
  answers, onChange, onGenerate,
}: {
  answers: HearingAnswers;
  onChange: (k: keyof HearingAnswers, v: string) => void;
  onGenerate: () => void;
}) {
  return (
    <div>
      <p className="mb-1 text-base font-semibold text-gray-900">最後に、プロジェクト名を入力してください</p>
      <p className="mb-5 text-sm text-gray-500">あとでエディターから変更できます。</p>
      <input
        type="text"
        autoFocus
        placeholder="例：新サービスのランディングページ"
        value={answers.projectName}
        onChange={(e) => onChange('projectName', e.target.value)}
        className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
      />
      <NextButton
        disabled={!answers.projectName.trim()}
        onClick={onGenerate}
        label="LPを生成する"
      />
    </div>
  );
}

// --- 生成中画面 ---

function GeneratingScreen() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
      <p className="text-base font-semibold text-gray-900">LP を生成中...</p>
      <p className="mt-2 text-sm text-gray-500">AIがコンテンツを作成しています。しばらくお待ちください。</p>
    </div>
  );
}

// --- 作成方法選択画面 ---

function ModeSelect({
  onSelectAI,
  onSelectManual,
}: {
  onSelectAI: (m: 'ai-full' | 'ai-template') => void;
  onSelectManual: () => void;
}) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-400 transition hover:text-gray-600"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          ダッシュボードへ戻る
        </Link>
        <h1 className="text-xl font-bold text-gray-900">新規プロジェクトを作成</h1>
        <p className="mt-1 text-sm text-gray-500">作成方法を選んでください</p>
      </div>

      <div className="space-y-3">
        {/* ① AIにおまかせ */}
        <button
          onClick={() => onSelectAI('ai-full')}
          className="w-full cursor-pointer rounded-xl border border-gray-200 bg-white p-5 text-left transition hover:border-gray-300 hover:shadow-sm"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-50">
              <svg className="h-5 w-5 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">AIにおまかせ</p>
              <p className="mt-0.5 text-sm text-gray-500">
                デザインもコンテンツも全てAIが生成。8つの質問に答えるだけでLPが完成します。
              </p>
            </div>
            <svg className="mt-0.5 h-5 w-5 shrink-0 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </div>
        </button>

        {/* ② テンプレート＋AI生成 */}
        <button
          onClick={() => onSelectAI('ai-template')}
          className="w-full cursor-pointer rounded-xl border border-gray-200 bg-white p-5 text-left transition hover:border-gray-300 hover:shadow-sm"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
              <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">テンプレート＋AI生成</p>
              <p className="mt-0.5 text-sm text-gray-500">
                デザインテンプレートを自分で選択。コンテンツはAIが自動生成します。
              </p>
            </div>
            <svg className="mt-0.5 h-5 w-5 shrink-0 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </div>
        </button>

        {/* ③ 手動で作成 */}
        <button
          onClick={onSelectManual}
          className="w-full cursor-pointer rounded-xl border border-gray-200 bg-white p-5 text-left transition hover:border-gray-300 hover:shadow-sm"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100">
              <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">手動で作成</p>
              <p className="mt-0.5 text-sm text-gray-500">
                エディターから自分でLPを作成します。
              </p>
            </div>
            <svg className="mt-0.5 h-5 w-5 shrink-0 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
}

// --- 手動作成フォーム ---

function ManualForm({ onBack }: { onBack: () => void }) {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', description: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? '作成に失敗しました');
        return;
      }
      router.push('/dashboard');
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-400 transition hover:text-gray-600"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        戻る
      </button>

      <h1 className="mb-6 text-xl font-bold text-gray-900">手動で作成</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
        )}

        <div>
          <label htmlFor="proj-name" className="mb-1 block text-sm font-medium text-gray-700">
            プロジェクト名 <span className="text-red-500">*</span>
          </label>
          <input
            id="proj-name"
            type="text"
            required
            autoFocus
            placeholder="例：新サービスのランディングページ"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
          />
        </div>

        <div>
          <label htmlFor="proj-desc" className="mb-1 block text-sm font-medium text-gray-700">
            説明 <span className="text-xs text-gray-400">（任意）</span>
          </label>
          <textarea
            id="proj-desc"
            rows={3}
            placeholder="どんなビジネス・サービスのLPですか？"
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-gray-950 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-60"
        >
          {loading ? '作成中…' : '作成する'}
        </button>
      </form>
    </div>
  );
}
