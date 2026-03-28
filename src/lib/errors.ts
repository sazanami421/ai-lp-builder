import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';

/**
 * アプリケーション固有のエラー
 * API ルートで意図的に throw してステータスコードを制御する
 */
export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// 便利なファクトリ関数
export const BadRequest = (message: string) => new AppError(400, message);
export const Unauthorized = (message = '認証が必要です') => new AppError(401, message);
export const Forbidden = (message = 'アクセス権限がありません') => new AppError(403, message);
export const NotFound = (message = 'リソースが見つかりません') => new AppError(404, message);
export const Conflict = (message: string) => new AppError(409, message);
export const PaymentRequired = (message: string) => new AppError(402, message);

/**
 * catch ブロック用の共通エラーハンドラ
 *
 * エラーの種類に応じて適切な HTTP ステータスコードを返す:
 * - AppError        → そのまま statusCode を使用
 * - Prisma P2002    → 409 Conflict（ユニーク制約違反）
 * - Prisma P2025    → 404 Not Found（レコード未発見）
 * - SyntaxError     → 400 Bad Request（JSON パース失敗など）
 * - その他          → 500 Internal Server Error
 */
export function handleApiError(err: unknown, context: string): NextResponse {
  // アプリケーションエラー（意図的に throw したもの）
  if (err instanceof AppError) {
    return NextResponse.json({ error: err.message }, { status: err.statusCode });
  }

  // JSON パースエラー（不正なリクエストボディ）
  if (err instanceof SyntaxError) {
    return NextResponse.json(
      { error: 'リクエストの形式が不正です' },
      { status: 400 }
    );
  }

  // Prisma 固有エラー
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002': {
        // ユニーク制約違反
        const target = (err.meta?.target as string[])?.join(', ') ?? '不明なフィールド';
        return NextResponse.json(
          { error: `${target} はすでに使用されています` },
          { status: 409 }
        );
      }
      case 'P2025':
        // レコード未発見（update/delete 対象が存在しない）
        return NextResponse.json(
          { error: '対象のデータが見つかりません' },
          { status: 404 }
        );
      case 'P2003':
        // 外部キー制約違反
        return NextResponse.json(
          { error: '関連するデータが見つかりません' },
          { status: 400 }
        );
      default:
        console.error(`[${context}] Prisma error ${err.code}:`, err.message);
        return NextResponse.json(
          { error: 'データベースエラーが発生しました' },
          { status: 500 }
        );
    }
  }

  // Prisma バリデーションエラー（型不一致など）
  if (err instanceof Prisma.PrismaClientValidationError) {
    console.error(`[${context}] Prisma validation:`, err.message);
    return NextResponse.json(
      { error: 'データの形式が不正です' },
      { status: 400 }
    );
  }

  // 予期しないエラー
  const message = err instanceof Error ? err.message : String(err);
  console.error(`[${context}]`, message);

  return NextResponse.json(
    {
      error: 'サーバーエラーが発生しました',
      // 開発環境のみ詳細を返す
      ...(process.env.NODE_ENV === 'development' && { detail: message }),
    },
    { status: 500 }
  );
}
