import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateLPSchema, formatZodError } from '@/lib/validations';
import { generateLP } from '@/lib/ai';
import { TEMPLATES } from '@/lib/templates';
import { handleApiError, BadRequest } from '@/lib/errors';
import { consumeAICredits, AI_CREDIT_COST } from '@/lib/plans';
import type { SectionType } from '@/types/section';

// 業種・ターゲット・CTAゴールの表示ラベルマッピング
const INDUSTRY_LABELS: Record<string, string> = {
  saas:    'SaaS・ソフトウェア',
  ec:      'EC・物販',
  law:     '士業・コンサル',
  food:    '飲食・カフェ',
  health:  '医療・美容・健康',
  other:   'その他',
};

const TARGET_LABELS: Record<string, string> = {
  personal:   '個人向け',
  smb:        '中小企業向け',
  enterprise: '大企業向け',
  broad:      '幅広く',
};

const CTA_GOAL_LABELS: Record<string, string> = {
  register: '無料登録',
  document: '資料請求',
  purchase: '購入',
  contact:  'お問い合わせ',
};

function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 40)
    .replace(/^-|-$/g, '');
  const suffix = Math.random().toString(36).slice(2, 7);
  return base ? `${base}-${suffix}` : suffix;
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }

  try {
    await consumeAICredits(session.user.id, AI_CREDIT_COST.generate);

    const body = await req.json();
    const parsed = generateLPSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 });
    }

    const { projectName, template, industry, target, usp, features, pricingCount, ctaGoal } = parsed.data;

    // ラベルに変換してAIに渡す
    const sections = await generateLP({
      projectName,
      industry:     INDUSTRY_LABELS[industry]  ?? industry,
      target:       TARGET_LABELS[target]       ?? target,
      usp,
      features,
      pricingCount: parseInt(pricingCount, 10),
      ctaGoal:      CTA_GOAL_LABELS[ctaGoal]   ?? ctaGoal,
    });

    if (sections.length === 0) {
      throw BadRequest('コンテンツの生成に失敗しました');
    }

    // テンプレートの defaultVariants を取得
    const templateDef = TEMPLATES[template as keyof typeof TEMPLATES];
    const defaultVariants = templateDef.defaultVariants;

    // スラッグ重複回避
    let slug = generateSlug(projectName);
    const existing = await prisma.project.findUnique({ where: { slug } });
    if (existing) slug = generateSlug(projectName);

    // プロジェクト → ページ → セクションを一括作成
    const project = await prisma.project.create({
      data: {
        userId: session.user.id,
        name: projectName,
        slug,
        description: null,
        pages: {
          create: {
            title: projectName,
            globalConfig: { template },
            sections: {
              create: sections.map((s, i) => ({
                type: s.type,
                order: i,
                visible: true,
                data: {
                  ...s.data,
                  variant: defaultVariants[s.type as SectionType],
                },
              })),
            },
          },
        },
      },
      include: {
        pages: { select: { id: true } },
      },
    });

    const pageId = project.pages[0]?.id;
    if (!pageId) throw new Error('ページの作成に失敗しました');

    return NextResponse.json({ pageId }, { status: 201 });
  } catch (err) {
    return handleApiError(err, 'POST /api/ai/generate');
  }
}
