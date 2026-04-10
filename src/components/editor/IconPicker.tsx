'use client';

import { useState } from 'react';
import { ICON_SET, type IconName, resolveIcon } from '@/lib/icons';
import Icon from '@/components/Icon';

type Props = {
  value: string | undefined;
  onChange: (iconName: string) => void;
};

export default function IconPicker({ value, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const resolved = resolveIcon(value);

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs hover:border-gray-300 cursor-pointer"
      >
        {resolved ? (
          <Icon name={value} size={20} />
        ) : (
          <span className="text-gray-400">アイコンなし</span>
        )}
        <span className="text-gray-500">▼</span>
      </button>

      {isOpen && (
        <div className="mt-2 rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
          <div className="mb-2 flex justify-between">
            <span className="text-xs font-medium text-gray-600">アイコンを選択</span>
            <button
              type="button"
              onClick={() => { onChange(''); setIsOpen(false); }}
              className="text-xs text-red-500 hover:underline"
            >
              削除
            </button>
          </div>
          <div className="grid grid-cols-6 gap-2">
            {(Object.keys(ICON_SET) as IconName[]).map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => { onChange(name); setIsOpen(false); }}
                className={`flex flex-col items-center gap-1 rounded p-2 hover:bg-gray-50 cursor-pointer ${
                  value === name ? 'bg-blue-50 ring-1 ring-blue-500' : ''
                }`}
                title={ICON_SET[name].labels[0]}
              >
                <Icon name={name} size={18} />
                <span className="text-[10px] text-gray-500">{ICON_SET[name].labels[0]}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
