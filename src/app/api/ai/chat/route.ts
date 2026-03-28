import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateSectionEdit } from '@/lib/ai';
import { aiChatSchema, formatZodError } from '@/lib/validations';
import { handleApiError } from '@/lib/errors';
import { consumeAICredits, AI_CREDIT_COST } from '@/lib/plans';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }

  try {
    await consumeAICredits(session.user.id, AI_CREDIT_COST.chat);

    const body = await req.json();
    const parsed = aiChatSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: formatZodError(parsed.error) },
        { status: 400 }
      );
    }

    const { sectionType, currentData, currentStyleOverrides, message } = parsed.data;

    const result = await generateSectionEdit(
      message,
      sectionType,
      currentData,
      currentStyleOverrides as Record<string, string>
    );

    return NextResponse.json(result);
  } catch (err) {
    return handleApiError(err, 'POST /api/ai/chat');
  }
}
