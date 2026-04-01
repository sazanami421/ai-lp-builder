import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { handleApiError, BadRequest, Conflict } from '@/lib/errors';
import { PLAN_LIMITS, AI_CREDIT_COST } from '@/lib/plans';
import { updateEmailSchema, updatePasswordSchema } from '@/lib/validations';
import { compare, hash } from 'bcryptjs';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: session.user.id },
      select: { plan: true, aiCreditsUsed: true, aiCreditsResetAt: true },
    });

    const limit = PLAN_LIMITS[user.plan].aiCreditsPerMonth;

    const now = new Date();
    const resetAt = new Date(user.aiCreditsResetAt);
    const isNewMonth =
      now.getFullYear() !== resetAt.getFullYear() ||
      now.getMonth() !== resetAt.getMonth();

    const used = isNewMonth ? 0 : user.aiCreditsUsed;
    const remaining = limit === Infinity ? Infinity : Math.max(0, limit - used);

    return NextResponse.json({
      plan: user.plan,
      aiCreditsUsed: used,
      aiCreditsLimit: limit,
      aiCreditsRemaining: remaining,
      creditCost: AI_CREDIT_COST,
    });
  } catch (err) {
    return handleApiError(err, 'GET /api/users/me');
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }

  try {
    const body = await req.json();

    // メールアドレス変更
    if ('email' in body) {
      const result = updateEmailSchema.safeParse(body);
      if (!result.success) {
        throw BadRequest(result.error.issues[0].message);
      }
      const { email } = result.data;

      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing && existing.id !== session.user.id) {
        throw Conflict('このメールアドレスはすでに使用されています');
      }

      await prisma.user.update({
        where: { id: session.user.id },
        data: { email },
      });

      return NextResponse.json({ message: 'メールアドレスを更新しました' });
    }

    // 会社名変更
    if ('companyName' in body) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { companyName: body.companyName ?? null },
      });
      return NextResponse.json({ message: '会社名を更新しました' });
    }

    // パスワード変更
    if ('currentPassword' in body) {
      const result = updatePasswordSchema.safeParse(body);
      if (!result.success) {
        throw BadRequest(result.error.issues[0].message);
      }
      const { currentPassword, newPassword } = result.data;

      const user = await prisma.user.findUniqueOrThrow({
        where: { id: session.user.id },
        select: { password: true },
      });

      if (!user.password) {
        throw BadRequest('このアカウントはパスワードでのログインに対応していません');
      }

      const isValid = await compare(currentPassword, user.password);
      if (!isValid) {
        throw BadRequest('現在のパスワードが正しくありません');
      }

      const hashed = await hash(newPassword, 12);
      await prisma.user.update({
        where: { id: session.user.id },
        data: { password: hashed },
      });

      return NextResponse.json({ message: 'パスワードを更新しました' });
    }

    throw BadRequest('変更するフィールドを指定してください');
  } catch (err) {
    return handleApiError(err, 'PATCH /api/users/me');
  }
}

export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }

  try {
    await prisma.user.delete({ where: { id: session.user.id } });
    return NextResponse.json({ message: 'アカウントを削除しました' });
  } catch (err) {
    return handleApiError(err, 'DELETE /api/users/me');
  }
}
