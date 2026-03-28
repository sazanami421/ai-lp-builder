'use client';

import { FormSectionData, FormField } from '@/types/section';
import { getVariant } from '@/lib/variants';

type Props = {
  data: FormSectionData;
  onUpdate: (newData: FormSectionData) => void;
};

const inputClass =
  'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-50';

const FIELD_TYPES: { value: FormField['type']; label: string }[] = [
  { value: 'text',     label: 'テキスト' },
  { value: 'email',    label: 'メール' },
  { value: 'textarea', label: 'テキストエリア' },
];

export default function FormForm({ data, onUpdate }: Props) {
  const variant = getVariant('form', data as Record<string, unknown>);
  const updateField = (index: number, patch: Partial<FormField>) => {
    const fields = data.fields.map((f, i) => i === index ? { ...f, ...patch } : f);
    onUpdate({ ...data, fields });
  };

  const addField = () => {
    onUpdate({
      ...data,
      fields: [...data.fields, { name: `field_${Date.now()}`, label: '', type: 'text', placeholder: '', required: false }],
    });
  };

  const removeField = (index: number) => {
    if (data.fields.length <= 1) return;
    onUpdate({ ...data, fields: data.fields.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">レイアウト</label>
        <div className="flex gap-2">
          {([
            { value: 'simple', label: 'シンプル' },
            { value: 'split', label: '左右分割' },
          ] as const).map((v) => (
            <button
              key={v.value}
              onClick={() => onUpdate({ ...data, variant: v.value })}
              className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition cursor-pointer ${
                variant === v.value
                  ? 'border-blue-500 bg-blue-50 text-blue-600'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">タイトル</label>
        <input type="text" value={data.title ?? ''} onChange={(e) => onUpdate({ ...data, title: e.target.value })}
          placeholder="お問い合わせ" className={inputClass} />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">説明文</label>
        <input type="text" value={data.description ?? ''} onChange={(e) => onUpdate({ ...data, description: e.target.value })}
          placeholder="ご質問はお気軽にどうぞ。" className={inputClass} />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium text-gray-600">フォームフィールド</span>
          <button onClick={addField} className="text-xs text-blue-500 hover:text-blue-700">+ 追加</button>
        </div>

        <div className="space-y-3">
          {data.fields.map((field, i) => (
            <div key={i} className="rounded-lg border border-gray-200 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">フィールド {i + 1}</span>
                <button onClick={() => removeField(i)} className="text-xs text-red-400 hover:text-red-600">削除</button>
              </div>
              <input type="text" value={field.label} onChange={(e) => updateField(i, { label: e.target.value })}
                placeholder="ラベル（例：お名前）" className={inputClass} />
              <div className="flex gap-2">
                <select value={field.type} onChange={(e) => updateField(i, { type: e.target.value as FormField['type'] })}
                  className={`${inputClass} w-1/2`}>
                  {FIELD_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
                <input type="text" value={field.placeholder ?? ''} onChange={(e) => updateField(i, { placeholder: e.target.value })}
                  placeholder="プレースホルダー" className={`${inputClass} w-1/2`} />
              </div>
              <label className="flex cursor-pointer items-center gap-2 text-xs text-gray-600">
                <input type="checkbox" checked={field.required} onChange={(e) => updateField(i, { required: e.target.checked })}
                  className="rounded border-gray-300" />
                必須項目
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">送信ボタンテキスト</label>
        <input type="text" value={data.submitText} onChange={(e) => onUpdate({ ...data, submitText: e.target.value })}
          placeholder="送信する" className={inputClass} />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">送信完了メッセージ</label>
        <input type="text" value={data.successMessage} onChange={(e) => onUpdate({ ...data, successMessage: e.target.value })}
          placeholder="送信ありがとうございます。" className={inputClass} />
      </div>
    </div>
  );
}
