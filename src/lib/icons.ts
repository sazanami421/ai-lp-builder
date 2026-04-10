import {
  Zap, Rocket, Shield, Gem, Sparkles, BarChart, Target, DollarSign,
  Smartphone, Star, Heart, Lock, CheckCircle, Users, Clock, TrendingUp,
  Globe, MessageCircle, Mail, Settings, Search, Bell, Calendar, BookOpen,
  Award, Gift, Lightbulb, ThumbsUp, Briefcase, Headphones,
  type LucideIcon,
} from 'lucide-react';

export type IconName =
  | 'zap' | 'rocket' | 'shield' | 'gem' | 'sparkles' | 'bar-chart'
  | 'target' | 'dollar-sign' | 'smartphone' | 'star' | 'heart' | 'lock'
  | 'check-circle' | 'users' | 'clock' | 'trending-up' | 'globe'
  | 'message-circle' | 'mail' | 'settings' | 'search' | 'bell'
  | 'calendar' | 'book-open' | 'award' | 'gift' | 'lightbulb'
  | 'thumbs-up' | 'briefcase' | 'headphones';

type IconEntry = {
  component: LucideIcon;
  labels: string[]; // 検索・AI生成用ラベル
};

export const ICON_SET: Record<IconName, IconEntry> = {
  'zap':            { component: Zap,           labels: ['高速', 'スピード', 'パワー', '電気'] },
  'rocket':         { component: Rocket,         labels: ['起動', 'スタート', 'ローンチ'] },
  'shield':         { component: Shield,         labels: ['セキュリティ', '保護', '安全'] },
  'gem':            { component: Gem,            labels: ['プレミアム', '品質', '高級'] },
  'sparkles':       { component: Sparkles,       labels: ['新機能', 'キラキラ', 'マジック'] },
  'bar-chart':      { component: BarChart,       labels: ['分析', 'データ', 'グラフ'] },
  'target':         { component: Target,         labels: ['目標', '精度', 'ターゲット'] },
  'dollar-sign':    { component: DollarSign,     labels: ['料金', 'お金', '収益'] },
  'smartphone':     { component: Smartphone,     labels: ['モバイル', 'スマホ'] },
  'star':           { component: Star,           labels: ['評価', '星', 'お気に入り'] },
  'heart':          { component: Heart,          labels: ['好き', '愛', 'ハート'] },
  'lock':           { component: Lock,           labels: ['セキュリティ', 'ロック', '鍵'] },
  'check-circle':   { component: CheckCircle,    labels: ['完了', '承認', 'チェック'] },
  'users':          { component: Users,          labels: ['チーム', 'ユーザー', 'コミュニティ'] },
  'clock':          { component: Clock,          labels: ['時間', 'スケジュール', '時計'] },
  'trending-up':    { component: TrendingUp,     labels: ['成長', '上昇', 'トレンド'] },
  'globe':          { component: Globe,          labels: ['グローバル', 'Web', '世界'] },
  'message-circle': { component: MessageCircle,  labels: ['チャット', 'メッセージ', '会話'] },
  'mail':           { component: Mail,           labels: ['メール', '連絡', 'お問い合わせ'] },
  'settings':       { component: Settings,       labels: ['設定', 'ツール', 'カスタマイズ'] },
  'search':         { component: Search,         labels: ['検索', '発見', '虫眼鏡'] },
  'bell':           { component: Bell,           labels: ['通知', 'ベル', 'アラート'] },
  'calendar':       { component: Calendar,       labels: ['予定', 'イベント', 'カレンダー'] },
  'book-open':      { component: BookOpen,       labels: ['学習', 'ドキュメント', '本'] },
  'award':          { component: Award,          labels: ['実績', '表彰', '賞'] },
  'gift':           { component: Gift,           labels: ['特典', 'プレゼント', 'ギフト'] },
  'lightbulb':      { component: Lightbulb,      labels: ['アイデア', 'ひらめき', '電球'] },
  'thumbs-up':      { component: ThumbsUp,       labels: ['いいね', '承認', 'グッド'] },
  'briefcase':      { component: Briefcase,      labels: ['ビジネス', '仕事', '鞄'] },
  'headphones':     { component: Headphones,     labels: ['サポート', 'オーディオ', 'ヘッドフォン'] },
};

// 絵文字 → アイコン名マッピング（既存データの後方互換用）
export const EMOJI_TO_ICON: Record<string, IconName> = {
  '⚡': 'zap', '💥': 'zap',
  '🚀': 'rocket', '🛸': 'rocket',
  '🛡️': 'shield', '🔰': 'shield',
  '💎': 'gem', '💠': 'gem',
  '✨': 'sparkles', '🌟': 'sparkles',
  '📊': 'bar-chart', '📉': 'bar-chart',
  '🎯': 'target', '🏹': 'target',
  '💰': 'dollar-sign', '💵': 'dollar-sign', '💴': 'dollar-sign',
  '💶': 'dollar-sign', '💷': 'dollar-sign',
  '📱': 'smartphone', '📲': 'smartphone',
  '⭐': 'star',
  '❤️': 'heart', '💖': 'heart', '💕': 'heart',
  '🔒': 'lock', '🔐': 'lock',
  '✅': 'check-circle', '☑️': 'check-circle',
  '👥': 'users',
  '⏰': 'clock', '⌛': 'clock', '⏱️': 'clock',
  '📈': 'trending-up',
  '🌐': 'globe', '🌍': 'globe', '🌎': 'globe', '🌏': 'globe',
  '💬': 'message-circle', '💭': 'message-circle',
  '📧': 'mail', '✉️': 'mail', '📨': 'mail',
  '⚙️': 'settings', '🔧': 'settings', '🛠️': 'settings',
  '🔍': 'search', '🔎': 'search',
  '🔔': 'bell', '🛎️': 'bell',
  '📅': 'calendar', '📆': 'calendar', '🗓️': 'calendar',
  '📖': 'book-open', '📚': 'book-open',
  '🏆': 'award', '🥇': 'award', '🎖️': 'award',
  '🎁': 'gift', '🎀': 'gift',
  '💡': 'lightbulb', '🔦': 'lightbulb',
  '👍': 'thumbs-up', '👌': 'thumbs-up',
  '💼': 'briefcase', '🗂️': 'briefcase',
  '🎧': 'headphones', '🎙️': 'headphones',
};

/**
 * アイコン文字列を Lucide コンポーネントに解決する
 * - アイコン名そのもの ("zap") → そのまま
 * - 絵文字 ("⚡") → マッピング表で変換
 * - 不明 → null（非表示）
 */
export function resolveIcon(iconString: string | undefined | null): LucideIcon | null {
  if (!iconString) return null;

  // 1. Lucideアイコン名として存在するか
  if (iconString in ICON_SET) {
    return ICON_SET[iconString as IconName].component;
  }

  // 2. 絵文字マッピング
  const mapped = EMOJI_TO_ICON[iconString];
  if (mapped) return ICON_SET[mapped].component;

  // 3. 不明
  return null;
}
