'use client';

import { PricingSectionData, PricingPlan } from '@/types/section';

type Props = {
  data: PricingSectionData;
  onUpdate: (newData: PricingSectionData) => void;
};

const inputClass =
  'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-50';

export default function PricingForm({ data, onUpdate }: Props) {
  const setTitle = (title: string) => onUpdate({ ...data, title });

  const updatePlan = (index: number, field: keyof PricingPlan, value: unknown) => {
    const plans = data.plans.map((plan, i) =>
      i === index ? { ...plan, [field]: value } : plan
    );
    onUpdate({ ...data, plans });
  };

  const addPlan = () => {
    onUpdate({
      ...data,
      plans: [...data.plans, { name: '', price: '', period: '月', features: [''], highlighted: false }],
    });
  };

  const removePlan = (index: number) => {
    onUpdate({ ...data, plans: data.plans.filter((_, i) => i !== index) });
  };

  const updateFeature = (planIndex: number, featIndex: number, value: string) => {
    const features = data.plans[planIndex].features.map((f, i) =>
      i === featIndex ? value : f
    );
    updatePlan(planIndex, 'features', features);
  };

  const addFeature = (planIndex: number) => {
    updatePlan(planIndex, 'features', [...data.plans[planIndex].features, '']);
  };

  const removeFeature = (planIndex: number, featIndex: number) => {
    const current = data.plans[planIndex].features;
    if (current.length <= 1) return; // 最低1件は残す
    updatePlan(planIndex, 'features', current.filter((_, i) => i !== featIndex));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">セクションタイトル</label>
        <input
          type="text"
          value={data.title ?? ''}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="料金プラン"
          className={inputClass}
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium text-gray-600">プラン</span>
          <button onClick={addPlan} className="text-xs text-blue-500 transition hover:text-blue-700">
            + プラン追加
          </button>
        </div>


        <div className="space-y-4">
          {data.plans.map((plan, i) => (
            <div key={i} className="rounded-lg border border-gray-200 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">プラン {i + 1}</span>
                <button
                  onClick={() => removePlan(i)}
                  className="text-xs text-red-400 transition hover:text-red-600"
                >
                  削除
                </button>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  value={plan.name}
                  onChange={(e) => updatePlan(i, 'name', e.target.value)}
                  placeholder="プラン名（例：Pro）"
                  className={inputClass}
                />

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={plan.price}
                    onChange={(e) => updatePlan(i, 'price', e.target.value)}
                    placeholder="価格（例：¥2,980）"
                    className={`${inputClass} w-[70%]`}
                  />
                  <input
                    type="text"
                    value={plan.period}
                    onChange={(e) => updatePlan(i, 'period', e.target.value)}
                    placeholder="期間"
                    className={`${inputClass} w-[30%]`}
                  />
                </div>

                <input
                  type="text"
                  value={plan.ctaText ?? ''}
                  onChange={(e) => updatePlan(i, 'ctaText', e.target.value)}
                  placeholder="ボタンテキスト（例：今すぐ試す）"
                  className={inputClass}
                />

                <input
                  type="url"
                  value={plan.ctaUrl ?? ''}
                  onChange={(e) => updatePlan(i, 'ctaUrl', e.target.value)}
                  placeholder="ボタンURL"
                  className={inputClass}
                />

                {/* 備考 */}
                <div>
                  <label className="mb-1 block text-xs text-gray-500">備考テキスト</label>
                  <input
                    type="text"
                    value={plan.note ?? ''}
                    onChange={(e) => updatePlan(i, 'note', e.target.value)}
                    placeholder="例：年間契約なら20%OFF"
                    className={inputClass}
                  />
                </div>

                {/* おすすめプランフラグ */}
                <label className="flex cursor-pointer items-center gap-2 text-xs text-gray-600">
                  <input
                    type="checkbox"
                    checked={plan.highlighted ?? false}
                    onChange={(e) => updatePlan(i, 'highlighted', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  おすすめプランとして強調表示
                </label>

                {/* 機能リスト */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-xs text-gray-500">含まれる機能</span>
                    <button onClick={() => addFeature(i)} className="text-xs text-blue-500 hover:text-blue-700">
                      + 追加
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {plan.features.map((feat, j) => (
                      <div key={j} className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={feat}
                          onChange={(e) => updateFeature(i, j, e.target.value)}
                          placeholder={`機能 ${j + 1}`}
                          className={inputClass}
                        />
                        <button onClick={() => removeFeature(i, j)} className="shrink-0 text-xs text-red-400 hover:text-red-600">
                          ✕
                        </button>
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
