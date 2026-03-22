import { z } from 'zod';

// ========================================
// 認証
// ========================================
export const registerSchema = z.object({
  name: z
    .string()
    .max(100, '名前は100文字以内で入力してください')
    .optional()
    .transform((v) => v?.trim() || undefined),
  email: z
    .string({ message: 'メールアドレスは必須です' })
    .email('メールアドレスの形式が正しくありません')
    .max(255, 'メールアドレスは255文字以内で入力してください'),
  password: z
    .string({ message: 'パスワードは必須です' })
    .min(8, 'パスワードは8文字以上で入力してください')
    .max(128, 'パスワードは128文字以内で入力してください'),
});

// ========================================
// プロジェクト
// ========================================
export const createProjectSchema = z.object({
  name: z
    .string({ message: 'プロジェクト名は必須です' })
    .min(1, 'プロジェクト名は必須です')
    .max(100, 'プロジェクト名は100文字以内で入力してください')
    .transform((v) => v.trim()),
  description: z
    .string()
    .max(500, '説明は500文字以内で入力してください')
    .optional()
    .transform((v) => v?.trim() || undefined),
});

// ========================================
// セクション
// ========================================
export const sectionTypeEnum = z.enum([
  'hero',
  'features',
  'testimonials',
  'pricing',
  'faq',
  'cta',
  'form',
  'footer',
]);

export const createSectionSchema = z.object({
  pageId: z.string().uuid('pageId の形式が不正です'),
  type: sectionTypeEnum,
});

export const updateSectionSchema = z
  .object({
    data: z.record(z.string(), z.unknown()).optional(),
    visible: z.boolean().optional(),
    styleOverrides: z.record(z.string(), z.string()).optional(),
  })
  .refine(
    (obj) => obj.data !== undefined || obj.visible !== undefined || obj.styleOverrides !== undefined,
    { message: '更新するフィールドが1つ以上必要です' }
  );

export const reorderSchema = z.object({
  orders: z
    .array(
      z.object({
        id: z.string().uuid('セクションIDの形式が不正です'),
        order: z.number().int().min(0, 'order は0以上の整数にしてください'),
      })
    )
    .min(1, '並び替え対象が必要です'),
});

// ========================================
// ページ
// ========================================
export const updatePageSchema = z
  .object({
    title: z.string().max(200, 'タイトルは200文字以内で入力してください').optional(),
    globalConfig: z.record(z.string(), z.unknown()).optional(),
    isPublished: z.boolean().optional(),
  })
  .refine(
    (obj) =>
      obj.title !== undefined || obj.globalConfig !== undefined || obj.isPublished !== undefined,
    { message: '更新するフィールドが1つ以上必要です' }
  );

// ========================================
// フォーム送信（公開LP）
// ========================================
export const formSubmissionSchema = z.object({
  pageId: z.string().uuid('pageId の形式が不正です'),
  data: z.record(z.string(), z.unknown()).refine((obj) => Object.keys(obj).length > 0, {
    message: 'フォームデータが空です',
  }),
});

// ========================================
// AIチャット
// ========================================
export const aiChatSchema = z.object({
  sectionType: sectionTypeEnum,
  currentData: z.record(z.string(), z.unknown()),
  currentStyleOverrides: z.record(z.string(), z.string()).optional().default({}),
  message: z
    .string({ message: 'メッセージは必須です' })
    .min(1, 'メッセージは必須です')
    .max(2000, 'メッセージは2000文字以内で入力してください')
    .transform((v) => v.trim()),
});

// ========================================
// ヘルパー: Zod エラーを整形して返す
// ========================================
export function formatZodError(error: z.ZodError): string {
  return error.issues.map((e) => e.message).join('、');
}
