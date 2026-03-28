import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/errors';

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get('session_id');
    if (!sessionId) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription'],
    });

    if (checkoutSession.payment_status !== 'paid') {
      return NextResponse.redirect(new URL('/dashboard/settings?upgrade=cancelled', req.url));
    }

    const userId = checkoutSession.metadata?.userId;
    if (!userId) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    const subscription = checkoutSession.subscription as import('stripe').Stripe.Subscription;

    await prisma.user.update({
      where: { id: userId },
      data: {
        plan: 'pro',
        stripeSubscriptionId: subscription.id,
        subscriptionStatus: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        // Proアップグレード時にクレジットをリセット
        aiCreditsUsed: 0,
        aiCreditsResetAt: new Date(),
      },
    });

    const baseUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3000';
    return NextResponse.redirect(new URL('/dashboard/settings?upgrade=success', baseUrl));
  } catch (err) {
    return handleApiError(err);
  }
}
