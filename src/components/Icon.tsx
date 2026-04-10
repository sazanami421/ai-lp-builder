import { resolveIcon } from '@/lib/icons';

type Props = {
  name: string | undefined | null;
  className?: string;
  size?: number;
};

/**
 * アイコン文字列を Lucide SVG としてレンダリング
 * - 解決できない場合は null を返す（何も表示しない）
 * - 色は currentColor（親要素の color を継承）
 * - size はデフォルト 32
 */
export default function Icon({ name, className, size = 32 }: Props) {
  const IconComponent = resolveIcon(name);
  if (!IconComponent) return null;
  return <IconComponent className={className} size={size} strokeWidth={1.75} />;
}
