'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PROBLEM_PRESETS } from '@/lib/problemPresets';

const TEMPLATES = [
  { value: 'simple',   label: 'シンプル',   accent: '#2B2B28', bg: '#FFFFFF', desc: 'ミニマル・モノトーン' },
  { value: 'business', label: 'ビジネス',   accent: '#1E56A0', bg: '#FFFFFF', desc: 'プロフェッショナル・信頼感' },
  { value: 'natural',  label: 'ナチュラル', accent: '#2D8A6E', bg: '#FAFAF7', desc: '自然・健康・ウェルネス' },
  { value: 'pop',      label: 'ポップ',     accent: '#FF6B35', bg: '#FFFBF5', desc: 'カラフル・親しみやすい' },
  { value: 'premium',  label: 'プレミアム', accent: '#C6A96C', bg: '#0F0F0F', desc: '高級感・ダーク' },
];

type Mode = 'select' | 'manual' | 'ai';

type HearingAnswers = {
  template: string;
  projectName: string;

  // Step 2
  businessModel: '' | 'btob' | 'btoc' | 'c2c' | 'btog';
  gender: '' | 'male' | 'female' | 'any';
  ageGroup: '' | 'teens' | '20-30s' | '40-50s' | '60s' | 'any';
  targetDescription: string;
  ctaGoal: '' | 'register' | 'document' | 'purchase' | 'contact';

  // Step 3
  tagline: string;
  problems: string[];
  problemsOther: string;
  valueFeatures: string[];

  // Step 4
  includePricing: boolean;
  includeTestimonials: boolean;

  // Step 5
  additionalNotes: string;
};

const EMPTY_ANSWERS: HearingAnswers = {
  template: '',
  projectName: '',
  businessModel: '',
  gender: '',
  ageGroup: '',
  targetDescription: '',
  ctaGoal: '',
  tagline: '',
  problems: [],
  problemsOther: '',
  valueFeatures: [''],
  includePricing: false,
  includeTestimonials: false,
  additionalNotes: '',
};

export default function NewProjectPage() {
  const [mode, setMode] = useState<Mode>('select');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<HearingAnswers>(EMPTY_ANSWERS);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<{ message: string; isLimit: boolean } | null>(null);
  const router = useRouter();

  const startAI = () => {
    setAnswers(EMPTY_ANSWERS);
    setStep(0);
    setMode('ai');
  };

  const goBack = () => {
    if (step <= 0) {
      setMode('select');
    } else {
      setStep((s) => s - 1);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);

    // TODO: Step 10 で新仕様のリクエストボディに更新
    const res = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectName: answers.projectName,
        template: answers.template,
        businessModel: answers.businessModel,
        gender: answers.gender,
        ageGroup: answers.ageGroup,
        targetDescription: answers.targetDescription || undefined,
        ctaGoal: answers.ctaGoal,
        tagline: answers.tagline,
        problems: answers.problems,
        problemsOther: answers.problemsOther || undefined,
        valueFeatures: answers.valueFeatures.filter((v) => v.trim()),
        includePricing: answers.includePricing,
        includeTestimonials: answers.includeTestimonials,
        additionalNotes: answers.additionalNotes || undefined,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      router.push(`/editor/${data.pageId}`);
    } else {
      const data = await res.json();
      setGenerating(false);
      setGenerateError({
        message: data.error ?? '生成に失敗しました。もう一度お試しください。',
        isLimit: res.status === 402,
      });
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

  if (generateError) {
    return (
      <div className="mx-auto max-w-md px-4 py-12">
        <div className={`rounded-xl border p-5 ${generateError.isLimit ? 'border-amber-200 bg-amber-50' : 'border-red-200 bg-red-50'}`}>
          <p className={`font-semibold ${generateError.isLimit ? 'text-amber-800' : 'text-red-700'}`}>
            {generateError.isLimit ? 'AIクレジットの上限に達しました' : '生成に失敗しました'}
          </p>
          <p className={`mt-1 text-sm ${generateError.isLimit ? 'text-amber-700' : 'text-red-600'}`}>
            {generateError.message}
          </p>
          {generateError.isLimit && (
            <a
              href="#"
              className="mt-3 block w-full rounded-lg bg-amber-500 py-2 text-center text-sm font-semibold text-white transition hover:bg-amber-600"
            >
              Proプランにアップグレード
            </a>
          )}
          <button
            onClick={() => setGenerateError(null)}
            className="mt-2 w-full rounded-lg border border-gray-200 py-2 text-sm text-gray-600 transition hover:bg-gray-50"
          >
            戻る
          </button>
        </div>
      </div>
    );
  }

  // AI フロー（step 0〜4）
  const totalSteps = 5;
  const currentStep = step + 1;

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
        <h1 className="text-xl font-bold text-gray-900">AIにおまかせ</h1>
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
      {step === 0 && (
        <TemplateStep
          value={answers.template}
          onChange={(v) => setAnswers((a) => ({ ...a, template: v }))}
          onNext={() => setStep(1)}
        />
      )}
      {step === 1 && (
        <Step1
          answers={answers}
          onChange={<K extends keyof HearingAnswers>(k: K, v: HearingAnswers[K]) => setAnswers((a) => ({ ...a, [k]: v }))}
          onNext={() => setStep(2)}
        />
      )}
      {step === 2 && (
        <Step2
          answers={answers}
          setAnswers={setAnswers}
          onNext={() => setStep(3)}
        />
      )}
      {step === 3 && (
        <Step3
          answers={answers}
          setAnswers={setAnswers}
          onNext={() => setStep(4)}
        />
      )}
      {step === 4 && (
        <Step4
          answers={answers}
          setAnswers={setAnswers}
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

// --- Step 0: テンプレート選択 ---

function TemplateStep({
  value, onChange, onNext,
}: {
  value: string; onChange: (v: string) => void; onNext: () => void;
}) {
  return (
    <div>
      <p className="mb-1 text-base font-semibold text-gray-900">デザインテンプレートを選択</p>
      <p className="mb-5 text-sm text-gray-500">雰囲気を選んでください。コンテンツはAIが生成します。</p>
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

// --- Step 1: サービスとターゲット ---

const BUSINESS_MODELS = [
  { value: 'btob', label: '法人向け（BtoB）' },
  { value: 'btoc', label: '個人向け（BtoC）' },
  { value: 'c2c',  label: '個人間取引（C2C）' },
  { value: 'btog', label: '行政機関向け（BtoG）' },
];

const GENDERS = [
  { value: 'male',   label: '男性中心' },
  { value: 'female', label: '女性中心' },
  { value: 'any',    label: '問わない' },
];

const AGE_GROUPS = [
  { value: 'teens',  label: '10代' },
  { value: '20-30s', label: '20-30代' },
  { value: '40-50s', label: '40-50代' },
  { value: '60s',    label: '60代以上' },
  { value: 'any',    label: '幅広く' },
];

const CTA_GOALS = [
  { value: 'register', label: '無料登録' },
  { value: 'document', label: '資料請求' },
  { value: 'purchase', label: '購入' },
  { value: 'contact',  label: 'お問い合わせ' },
];

function Step1({
  answers, onChange, onNext,
}: {
  answers: HearingAnswers;
  onChange: <K extends keyof HearingAnswers>(k: K, v: HearingAnswers[K]) => void;
  onNext: () => void;
}) {
  const inputClass = 'w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100';

  const canNext = !!(
    answers.projectName.trim() &&
    answers.businessModel &&
    answers.gender &&
    answers.ageGroup &&
    answers.ctaGoal
  );

  return (
    <div className="space-y-6">
      {/* プロジェクト名 */}
      <div>
        <FieldLabel>プロジェクト名 <span className="text-red-500">*</span></FieldLabel>
        <input
          type="text"
          autoFocus
          placeholder="例：新サービスのランディングページ"
          value={answers.projectName}
          onChange={(e) => onChange('projectName', e.target.value)}
          className={inputClass}
        />
      </div>

      {/* ビジネスモデル */}
      <div>
        <FieldLabel>ビジネスモデル <span className="text-red-500">*</span></FieldLabel>
        <div className="grid grid-cols-2 gap-2">
          {BUSINESS_MODELS.map((o) => (
            <SelectCard
              key={o.value}
              selected={answers.businessModel === o.value}
              onClick={() => onChange('businessModel', o.value as HearingAnswers['businessModel'])}
            >
              {o.label}
            </SelectCard>
          ))}
        </div>
      </div>

      {/* 性別 */}
      <div>
        <FieldLabel>ターゲットの性別 <span className="text-red-500">*</span></FieldLabel>
        <div className="grid grid-cols-3 gap-2">
          {GENDERS.map((o) => (
            <SelectCard
              key={o.value}
              selected={answers.gender === o.value}
              onClick={() => onChange('gender', o.value as HearingAnswers['gender'])}
            >
              {o.label}
            </SelectCard>
          ))}
        </div>
      </div>

      {/* 年代 */}
      <div>
        <FieldLabel>ターゲットの年代 <span className="text-red-500">*</span></FieldLabel>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {AGE_GROUPS.map((o) => (
            <SelectCard
              key={o.value}
              selected={answers.ageGroup === o.value}
              onClick={() => onChange('ageGroup', o.value as HearingAnswers['ageGroup'])}
            >
              {o.label}
            </SelectCard>
          ))}
        </div>
      </div>

      {/* ターゲットの特徴（任意） */}
      <div>
        <FieldLabel>ターゲットの特徴 <span className="text-xs font-normal text-gray-400">（任意）</span></FieldLabel>
        <input
          type="text"
          placeholder="例: Web制作初心者のフリーランス"
          value={answers.targetDescription}
          onChange={(e) => onChange('targetDescription', e.target.value)}
          className={inputClass}
        />
      </div>

      {/* CTAのゴール */}
      <div>
        <FieldLabel>CTAのゴール <span className="text-red-500">*</span></FieldLabel>
        <div className="grid grid-cols-2 gap-2">
          {CTA_GOALS.map((o) => (
            <SelectCard
              key={o.value}
              selected={answers.ctaGoal === o.value}
              onClick={() => onChange('ctaGoal', o.value as HearingAnswers['ctaGoal'])}
            >
              {o.label}
            </SelectCard>
          ))}
        </div>
      </div>

      <NextButton disabled={!canNext} onClick={onNext} />
    </div>
  );
}

// --- Step 2: サービスの価値 ---

function Step2({
  answers,
  setAnswers,
  onNext,
}: {
  answers: HearingAnswers;
  setAnswers: React.Dispatch<React.SetStateAction<HearingAnswers>>;
  onNext: () => void;
}) {
  const inputClass = 'w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100';

  const categories = answers.businessModel ? PROBLEM_PRESETS[answers.businessModel] : [];

  const toggleProblem = (value: string) => {
    setAnswers((a) => ({
      ...a,
      problems: a.problems.includes(value)
        ? a.problems.filter((v) => v !== value)
        : [...a.problems, value],
    }));
  };

  const updateValueFeature = (index: number, value: string) => {
    setAnswers((a) => {
      const next = [...a.valueFeatures];
      next[index] = value;
      return { ...a, valueFeatures: next };
    });
  };

  const addValueFeature = () => {
    setAnswers((a) => ({ ...a, valueFeatures: [...a.valueFeatures, ''] }));
  };

  const removeValueFeature = (index: number) => {
    setAnswers((a) => ({
      ...a,
      valueFeatures: a.valueFeatures.filter((_, i) => i !== index),
    }));
  };

  const canNext = !!(
    answers.tagline.trim() &&
    answers.problems.length >= 1 &&
    answers.valueFeatures.filter((v) => v.trim()).length >= 1
  );

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-1 text-base font-semibold text-gray-900">サービスの価値</p>
        <p className="text-sm text-gray-500">AIがコピーを書くための素材を教えてください。</p>
      </div>

      {/* 一言で言うと */}
      <div>
        <FieldLabel>一言で言うと？ <span className="text-red-500">*</span></FieldLabel>
        <input
          type="text"
          placeholder="例: 5分でLPが作れるSaaS"
          value={answers.tagline}
          onChange={(e) => setAnswers((a) => ({ ...a, tagline: e.target.value }))}
          className={inputClass}
        />
      </div>

      {/* 解決する課題 */}
      <div>
        <FieldLabel>解決する課題 <span className="text-red-500">*</span><span className="ml-1 text-xs font-normal text-gray-400">（複数選択可）</span></FieldLabel>
        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category.label}>
              <p className="mb-1.5 text-xs font-medium text-gray-500">
                {category.icon && <span className="mr-1">{category.icon}</span>}
                {category.label}
              </p>
              <div className="space-y-1.5">
                {category.items.map((item) => {
                  const checked = answers.problems.includes(item.value);
                  return (
                    <label
                      key={item.value}
                      className="flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2 text-sm transition"
                      style={{
                        borderColor: checked ? '#111827' : '#E5E7EB',
                        backgroundColor: checked ? '#F9FAFB' : '#FFFFFF',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleProblem(item.value)}
                        className="h-4 w-4 rounded accent-gray-900"
                      />
                      <span className="text-gray-800">{item.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        {/* その他 */}
        <div className="mt-3">
          <p className="mb-1 text-xs font-medium text-gray-500">その他・自由記述</p>
          <input
            type="text"
            placeholder="例: 納期が読めない、品質が安定しない"
            value={answers.problemsOther}
            onChange={(e) => setAnswers((a) => ({ ...a, problemsOther: e.target.value }))}
            className={inputClass}
          />
        </div>
      </div>

      {/* 強み・価値 */}
      <div>
        <FieldLabel>
          強み・価値を箇条書きで <span className="text-red-500">*</span>
          <span className="ml-1 text-xs font-normal text-gray-400">（最大5つ）</span>
        </FieldLabel>
        <div className="space-y-2">
          {answers.valueFeatures.map((feat, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                placeholder={`例: ${['導入3分、クレカ不要で即スタート', 'AIが業界別の最適コピーを自動生成', '公開URLを共有するだけでLP完成'][i % 3]}`}
                value={feat}
                onChange={(e) => updateValueFeature(i, e.target.value)}
                className={inputClass}
              />
              {answers.valueFeatures.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeValueFeature(i)}
                  className="shrink-0 rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                  aria-label="削除"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
        {answers.valueFeatures.length < 5 && (
          <button
            type="button"
            onClick={addValueFeature}
            className="mt-2 inline-flex items-center gap-1 text-sm text-gray-500 transition hover:text-gray-700"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            追加
          </button>
        )}
      </div>

      <NextButton disabled={!canNext} onClick={onNext} />
    </div>
  );
}

// --- Step 3: 含めるセクション選択（Step 6 で実装）---

function Step3({
  onNext,
}: {
  answers: HearingAnswers;
  setAnswers: React.Dispatch<React.SetStateAction<HearingAnswers>>;
  onNext: () => void;
}) {
  return (
    <div>
      <p className="text-sm text-gray-500">（Step 6 で実装予定）</p>
      <NextButton onClick={onNext} />
    </div>
  );
}

// --- Step 4: その他伝えたいこと（Step 7 で実装）---

function Step4({
  onGenerate,
}: {
  answers: HearingAnswers;
  setAnswers: React.Dispatch<React.SetStateAction<HearingAnswers>>;
  onGenerate: () => void;
}) {
  return (
    <div>
      <p className="text-sm text-gray-500">（Step 7 で実装予定）</p>
      <NextButton onClick={onGenerate} label="LPを生成する" />
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
  onSelectAI: () => void;
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
        {/* AIにおまかせ */}
        <button
          onClick={onSelectAI}
          className="w-full cursor-pointer rounded-xl border border-gray-200 bg-white p-5 text-left transition hover:border-gray-300 hover:shadow-sm"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-50">
              <svg className="h-5 w-5 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-gray-900">AIにおまかせ</p>
                <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700">
                  3pt消費
                </span>
              </div>
              <p className="mt-0.5 text-sm text-gray-500">
                テンプレートを選んで質問に答えるだけ。AIがコンテンツを自動生成してLPを完成させます。
              </p>
            </div>
            <svg className="mt-0.5 h-5 w-5 shrink-0 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </div>
        </button>

        {/* 手動で作成 */}
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
