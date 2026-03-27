import type { CSSProperties } from 'react';

/**
 * セクションのルート要素スタイルを構築する。
 *
 * `background`（ショートハンド）と `backgroundColor`（個別プロパティ）を
 * 同一 style オブジェクト内で混在させると React の警告が発生するため、
 * styleOverrides に `background` がある場合は常に `background` のみ使用し、
 * ない場合は `background` + `backgroundImage` で構成する。
 */
export function buildSectionStyle(
  defaultBg: string,
  styleOverrides?: Record<string, string>
): CSSProperties {
  const { background, ...rest } = styleOverrides ?? {};

  if (background) {
    return {
      background,
      color: 'var(--text)',
      fontFamily: 'var(--font-body)',
      ...rest,
    };
  }

  return {
    background: defaultBg,
    backgroundImage: 'var(--texture)',
    color: 'var(--text)',
    fontFamily: 'var(--font-body)',
    ...rest,
  };
}
