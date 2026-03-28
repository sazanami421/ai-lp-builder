'use client';

import { PricingTableSectionData, PricingTablePlan } from '@/types/section';

type Props = {
  data: PricingTableSectionData;
  onUpdate: (newData: PricingTableSectionData) => void;
};

const inputClass =
  'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-50';

export default function PricingTableForm({ data, onUpdate }: Props) {
  // 機能行の操作
  const updateFeatureLabel = (fi: number, value: string) => {
    const features = data.features.map((f, i) => (i === fi ? value : f));
    onUpdate({ ...data, features });
  };

  const addFeature = () => {
    const features = [...data.features, ''];
    const plans = data.plans.map((p) => ({ ...p, values: [...p.values, false] }));
    onUpdate({ ...data, features, plans });
  };

  const removeFeature = (fi: number) => {
    if (data.features.length <= 1) return;
    const features = data.features.filter((_, i) => i !== fi);
    const plans = data.plans.map((p) => ({
      ...p,
      values: p.values.filter((_, i) => i !== fi),
    }));
    onUpdate({ ...data, features, plans });
  };

  // プランの操作
  const updatePlan = (pi: number, field: keyof PricingTablePlan, value: unknown) => {
    const plans = data.plans.map((p, i) => (i === pi ? { ...p, [field]: value } : p));
    onUpdate({ ...data, plans });
  };

  const updateValue = (pi: number, fi: number, raw: string) => {
    // "true" → boolean true, "false" → boolean false, それ以外はそのまま文字列
    const parsed: string | boolean =
      raw === 'true' ? true : raw === 'false' ? false : raw;
    const values = data.plans[pi].values.map((v, i) => (i === fi ? parsed : v));
    updatePlan(pi, 'values', values);
  };

  const addPlan = () => {
    const newPlan: PricingTablePlan = {
      name: '',
      price: '',
      period: '月',
      values: data.features.map(() => false),
      ctaText: '',
    };
    onUpdate({ ...data, plans: [...data.plans, newPlan] });
  };

  const removePlan = (pi: number) => {
    onUpdate({ ...data, plans: data.plans.filter((_, i) => i !== pi) });
  };

  return (
    <div className="space-y-5">
      {/* タイトル */}
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">セクションタイトル</label>
        <input
          type="text"
          value={data.title ?? ''}
          onChange={(e) => onUpdate({ ...data, title: e.target.value })}
          placeholder="機能比較"
          className={inputClass}
        />
      </div>

      {/* 機能行ラベル */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium text-gray-600">機能行ラベル</span>
          <button onClick={addFeature} className="text-xs text-blue-500 transition hover:text-blue-700">
            + 行追加
          </button>
        </div>
        <div className="space-y-1.5">
          {data.features.map((f, fi) => (
            <div key={fi} className="flex items-center gap-1.5">
              <input
                type="text"
                value={f}
                onChange={(e) => updateFeatureLabel(fi, e.target.value)}
                placeholder={`機能 ${fi + 1}`}
                className={inputClass}
              />
              <button
                onClick={() => removeFeature(fi)}
                className="shrink-0 text-xs text-red-400 transition hover:text-red-600"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* プラン */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium text-gray-600">プラン</span>
          <button onClick={addPlan} className="text-xs text-blue-500 transition hover:text-blue-700">
            + プラン追加
          </button>
        </div>

        <div className="space-y-4">
          {data.plans.map((plan, pi) => (
            <div key={pi} className="rounded-lg border border-gray-200 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">プラン {pi + 1}</span>
                <button
                  onClick={() => removePlan(pi)}
                  className="text-xs text-red-400 transition hover:text-red-600"
                >
                  削除
                </button>
              </div>

              <div className="space-y-2">
                {/* プラン名・価格 */}
                <input
                  type="text"
                  value={plan.name}
                  onChange={(e) => updatePlan(pi, 'name', e.target.value)}
                  placeholder="プラン名（例：Pro）"
                  className={inputClass}
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={plan.price}
                    onChange={(e) => updatePlan(pi, 'price', e.target.value)}
                    placeholder="価格（例：¥2,980）"
                    className={`${inputClass} w-[70%]`}
                  />
                  <input
                    type="text"
                    value={plan.period}
                    onChange={(e) => updatePlan(pi, 'period', e.target.value)}
                    placeholder="月"
                    className={`${inputClass} w-[30%]`}
                  />
                </div>
                <input
                  type="text"
                  value={plan.ctaText ?? ''}
                  onChange={(e) => updatePlan(pi, 'ctaText', e.target.value)}
                  placeholder="ボタンテキスト"
                  className={inputClass}
                />

                {/* おすすめフラグ */}
                <label className="flex cursor-pointer items-center gap-2 text-xs text-gray-600">
                  <input
                    type="checkbox"
                    checked={plan.highlighted ?? false}
                    onChange={(e) => updatePlan(pi, 'highlighted', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  おすすめプランとして強調表示
                </label>

                {/* 各機能の値 */}
                <div>
                  <p className="mb-1.5 text-xs text-gray-500">各機能の値</p>
                  <div className="space-y-1.5">
                    {data.features.map((feat, fi) => (
                      <div key={fi} className="flex items-center gap-2">
                        <span className="w-1/2 truncate text-xs text-gray-500">{feat || `機能 ${fi + 1}`}</span>
                        <select
                          value={
                            plan.values[fi] === true
                              ? 'true'
                              : plan.values[fi] === false
                              ? 'false'
                              : 'custom'
                          }
                          onChange={(e) => updateValue(pi, fi, e.target.value)}
                          className="flex-1 rounded border border-gray-200 px-2 py-1.5 text-xs text-gray-900 outline-none focus:border-blue-400"
                        >
                          <option value="true">✓ あり</option>
                          <option value="false">− なし</option>
                          <option value="custom">テキスト入力</option>
                        </select>
                        {plan.values[fi] !== true && plan.values[fi] !== false && (
                          <input
                            type="text"
                            value={String(plan.values[fi] ?? '')}
                            onChange={(e) => updateValue(pi, fi, e.target.value)}
                            placeholder="例：3回/月"
                            className="flex-1 rounded border border-gray-200 px-2 py-1.5 text-xs text-gray-900 outline-none focus:border-blue-400"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
