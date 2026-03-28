import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { verifyDomain } from '@/lib/vercel';
import { handleApiError, NotFound } from '@/lib/errors';

type Props = { params: Promise<{ domain: string }> };

export async function GET(req: NextRequest, { params }: Props) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { domain } = await params;

    const page = await prisma.page.findFirst({
      where: { customDomain: domain, project: { userId: session.user.id } },
      select: { id: true },
    });
    if (!page) throw NotFound('ドメインが見つかりません');

    const result = await verifyDomain(domain);

    if (result.verified) {
      await prisma.page.update({
        where: { id: page.id },
        data: { domainVerified: true },
      });
    }

    return NextResponse.json(result);
  } catch (err) {
    return handleApiError(err, 'GET /api/domains/[domain]/verify');
  }
}
