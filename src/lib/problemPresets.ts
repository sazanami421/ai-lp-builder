import type { BusinessModel } from './ai';

export type ProblemCategory = {
  label: string;
  icon?: string;
  items: { value: string; label: string }[];
};

export const PROBLEM_PRESETS: Record<BusinessModel, ProblemCategory[]> = {
  btob: [
    {
      label: '売上・収益',
      icon: '💰',
      items: [
        { value: 'btob-new-customer',    label: '新規顧客が増えない' },
        { value: 'btob-unit-price',      label: '客単価が上がらない' },
        { value: 'btob-retention',       label: 'リピート率が低い' },
      ],
    },
    {
      label: '業務効率・生産性',
      icon: '⚡',
      items: [
        { value: 'btob-time',            label: '作業に時間がかかりすぎる' },
        { value: 'btob-mistakes',        label: '人的ミスが多い' },
        { value: 'btob-silo',            label: '業務が属人化している' },
      ],
    },
    {
      label: 'マーケティング・集客',
      icon: '🎯',
      items: [
        { value: 'btob-awareness',       label: '認知度が低い' },
        { value: 'btob-inquiry',         label: '問い合わせが来ない' },
        { value: 'btob-differentiation', label: '競合と差別化できない' },
      ],
    },
    {
      label: '人材・組織',
      icon: '👥',
      items: [
        { value: 'btob-shortage',        label: '人手不足' },
        { value: 'btob-recruiting',      label: '採用がうまくいかない' },
        { value: 'btob-skill',           label: 'スキル不足' },
      ],
    },
    {
      label: '品質・コスト',
      icon: '💎',
      items: [
        { value: 'btob-quality',         label: '品質がばらつく' },
        { value: 'btob-cost',            label: '外注費・固定費が高い' },
      ],
    },
  ],

  btoc: [
    {
      label: '時間・手間',
      icon: '⏰',
      items: [
        { value: 'btoc-busy',            label: '忙しくて時間がない' },
        { value: 'btoc-hassle',          label: '面倒・手間がかかる' },
        { value: 'btoc-habit',           label: '続けられない' },
      ],
    },
    {
      label: 'お金・コスト',
      icon: '💸',
      items: [
        { value: 'btoc-expensive',       label: '費用が高い' },
        { value: 'btoc-deal',            label: 'お得に買いたい' },
      ],
    },
    {
      label: '知識・スキル',
      icon: '📚',
      items: [
        { value: 'btoc-howto',           label: 'やり方がわからない' },
        { value: 'btoc-choice',          label: '選び方がわからない' },
        { value: 'btoc-beginner',        label: '初心者で不安' },
      ],
    },
    {
      label: '効果・品質',
      icon: '✨',
      items: [
        { value: 'btoc-effect',          label: '効果が出ない・実感できない' },
        { value: 'btoc-fit',             label: '自分に合うものが見つからない' },
      ],
    },
    {
      label: '信頼・安心',
      icon: '🤝',
      items: [
        { value: 'btoc-info',            label: '信頼できる情報が少ない' },
        { value: 'btoc-fail',            label: '失敗したくない' },
      ],
    },
    {
      label: '生活・健康',
      icon: '🌱',
      items: [
        { value: 'btoc-health',          label: '健康・美容の悩み' },
        { value: 'btoc-lifestyle',       label: 'ライフスタイルを改善したい' },
      ],
    },
  ],

  c2c: [
    {
      label: '取引全般',
      items: [
        { value: 'c2c-buyer',            label: '買い手が見つからない' },
        { value: 'c2c-seller',           label: '売り手が見つからない' },
        { value: 'c2c-trust',            label: '信頼できる相手がわからない' },
        { value: 'c2c-trouble',          label: 'トラブルが心配' },
        { value: 'c2c-fee',              label: '手数料が高い' },
        { value: 'c2c-payment',          label: '決済・配送が面倒' },
        { value: 'c2c-communication',    label: 'コミュニケーションが難しい' },
        { value: 'c2c-price',            label: '取引相場がわからない' },
      ],
    },
  ],

  btog: [
    {
      label: '行政課題',
      items: [
        { value: 'btog-budget',          label: '予算・コスト制約' },
        { value: 'btog-service',         label: '住民サービスの質向上' },
        { value: 'btog-dx',              label: '業務のDX・デジタル化' },
        { value: 'btog-silo',            label: '属人化・引き継ぎ問題' },
        { value: 'btog-compliance',      label: '規制・コンプライアンス対応' },
        { value: 'btog-section',         label: '縦割り・部署間連携' },
        { value: 'btog-shortage',        label: '人員不足' },
        { value: 'btog-citizen',         label: '市民とのコミュニケーション' },
      ],
    },
  ],
};

// value → label 逆引き（選択値からラベル取得用）
export function getProblemLabel(value: string): string | null {
  for (const model of Object.values(PROBLEM_PRESETS)) {
    for (const category of model) {
      const found = category.items.find((item) => item.value === value);
      if (found) return found.label;
    }
  }
  return null;
}
