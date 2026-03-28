import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

// Next.js App Router では body が自動パースされるため、raw text で受け取る
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[Webhook] constructEvent failed:', message);
    return NextResponse.json({ error: `Webhook error: ${message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(sub);
        break;
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(sub);
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }
      default:
        // 未処理のイベントは無視
        break;
    }
  } catch (err) {
    console.error(`[Webhook] handler error for ${event.type}:`, err);
    return NextResponse.json({ error: 'Handler error' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

// サブスクリプション更新（cancelAtPeriodEnd変更、プラン変更など）
async function handleSubscriptionUpdated(sub: Stripe.Subscription) {
  const user = await prisma.user.findFirst({
    where: { stripeSubscriptionId: sub.id },
    select: { id: true },
  });

  if (!user) {
    // stripeCustomerId から検索（初回 Checkout 後に subscriptionId が未設定の場合の保険）
    const customer = await prisma.user.findFirst({
      where: { stripeCustomerId: sub.customer as string },
      select: { id: true },
    });
    if (!customer) {
      console.warn('[Webhook] user not found for subscription:', sub.id);
      return;
    }
  }

  const userId = user?.id ?? (
    await prisma.user.findFirst({
      where: { stripeCustomerId: sub.customer as string },
      select: { id: true },
    })
  )?.id;

  if (!userId) return;

  await prisma.user.update({
    where: { id: userId },
    data: {
      stripeSubscriptionId: sub.id,
      subscriptionStatus: sub.status,
      currentPeriodEnd: (sub as any).current_period_end
        ? new Date((sub as any).current_period_end * 1000)
        : null,
      cancelAtPeriodEnd: sub.cancel_at_period_end,
      // active / trialing ならProプランを維持、それ以外はfreeに降格
      plan: sub.status === 'active' || sub.status === 'trialing' ? 'pro' : 'free',
    },
  });
}

// サブスクリプション削除（期間終了・即時解約）→ Freeプランに降格
async function handleSubscriptionDeleted(sub: Stripe.Subscription) {
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { stripeSubscriptionId: sub.id },
        { stripeCustomerId: sub.customer as string },
      ],
    },
    select: { id: true },
  });

  if (!user) {
    console.warn('[Webhook] user not found for deleted subscription:', sub.id);
    return;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      plan: 'free',
      subscriptionStatus: 'canceled',
      cancelAtPeriodEnd: false,
      stripeSubscriptionId: null,
      currentPeriodEnd: null,
    },
  });
}

// 支払い失敗 → subscriptionStatus を past_due に更新
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  if (!invoice.subscription) return;

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { stripeSubscriptionId: invoice.subscription as string },
        { stripeCustomerId: invoice.customer as string },
      ],
    },
    select: { id: true },
  });

  if (!user) {
    console.warn('[Webhook] user not found for invoice:', invoice.id);
    return;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { subscriptionStatus: 'past_due' },
  });
}
