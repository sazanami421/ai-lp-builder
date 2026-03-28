import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { handleApiError, BadRequest } from '@/lib/errors';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { stripeCustomerId: true },
    });

    if (!user?.stripeCustomerId) {
      throw BadRequest('Stripe顧客情報が見つかりません');
    }

    const baseUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3000';

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${baseUrl}/dashboard/settings`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (err) {
    return handleApiError(err, 'POST /api/stripe/portal');
  }
}
