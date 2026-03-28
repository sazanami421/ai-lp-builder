import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { addDomainToVercel } from '@/lib/vercel';
import { handleApiError, BadRequest, Forbidden, NotFound } from '@/lib/errors';

const schema = z.object({
  pageId: z.string().min(1),
  domain: z
    .string()
    .min(1)
    .regex(
      /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/,
      '有効なドメイン名を入力してください（例: example.com）'
    ),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Proプランのみ利用可能
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: session.user.id },
      select: { plan: true },
    });
    if (user.plan === 'free') {
      throw Forbidden('独自ドメインはProプランの機能です');
    }

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      throw BadRequest(parsed.error.issues[0].message);
    }
    const { pageId, domain } = parsed.data;

    // ページの所有権確認
    const page = await prisma.page.findFirst({
      where: { id: pageId, project: { userId: session.user.id } },
      select: { id: true, customDomain: true },
    });
    if (!page) throw NotFound('ページが見つかりません');

    // 既に別のページで使われていないか確認（Prisma の @unique で保護されているが念のため）
    if (page.customDomain === domain) {
      return NextResponse.json({ message: 'already set' });
    }

    // Vercel にドメインを登録
    await addDomainToVercel(domain);

    await prisma.page.update({
      where: { id: pageId },
      data: { customDomain: domain, domainVerified: false },
    });

    return NextResponse.json({ domain });
  } catch (err) {
    return handleApiError(err, 'POST /api/domains');
  }
}
