import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateSectionEdit } from '@/lib/ai';
import { aiChatSchema, formatZodError } from '@/lib/validations';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = aiChatSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: formatZodError(parsed.error) },
        { status: 400 }
      );
    }

    const { currentData, currentStyleOverrides, message } = parsed.data;

    const result = await generateSectionEdit(
      message,
      currentData,
      currentStyleOverrides as Record<string, string>
    );

    return NextResponse.json(result);
  } catch (err) {
    console.error('[POST /api/ai/chat]', err);
    return NextResponse.json({ error: 'AI 生成に失敗しました' }, { status: 500 });
  }
}
