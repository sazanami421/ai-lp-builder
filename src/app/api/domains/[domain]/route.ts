import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { removeDomainFromVercel } from '@/lib/vercel';
import { handleApiError, NotFound } from '@/lib/errors';

type Props = { params: Promise<{ domain: string }> };

export async function DELETE(req: NextRequest, { params }: Props) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { domain } = await params;

    // ページの所有権確認
    const page = await prisma.page.findFirst({
      where: { customDomain: domain, project: { userId: session.user.id } },
      select: { id: true },
    });
    if (!page) throw NotFound('ドメインが見つかりません');

    await removeDomainFromVercel(domain);

    await prisma.page.update({
      where: { id: page.id },
      data: { customDomain: null, domainVerified: false },
    });

    return NextResponse.json({ deleted: true });
  } catch (err) {
    return handleApiError(err, 'DELETE /api/domains/[domain]');
  }
}
