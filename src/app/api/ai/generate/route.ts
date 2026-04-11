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

const BUSINESS_MODEL_LABELS: Record<string, string> = {
  btob: '法人向け（BtoB）',
  btoc: '個人向け（BtoC）',
  c2c:  '個人間取引（C2C）',
  btog: '行政機関向け（BtoG）',
};

const GENDER_LABELS: Record<string, string> = {
  male:   '男性中心',
  female: '女性中心',
  any:    '問わない',
};

const AGE_GROUP_LABELS: Record<string, string> = {
  teens:   '10代',
  '20-30s': '20-30代',
  '40-50s': '40-50代',
  '60s':    '60代以上',
  any:      '幅広く',
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

    const {
      projectName,
      template,
      businessModel,
      gender,
      ageGroup,
      targetDescription,
      ctaGoal,
      tagline,
      problems,
      problemsOther,
      valueFeatures,
      includePricing,
      includeTestimonials,
      additionalNotes,
    } = parsed.data;

    // ラベルに変換してAIに渡す
    const sections = await generateLP({
      projectName,
      businessModel:    BUSINESS_MODEL_LABELS[businessModel] ?? businessModel,
      gender:           GENDER_LABELS[gender]                ?? gender,
      ageGroup:         AGE_GROUP_LABELS[ageGroup]           ?? ageGroup,
      targetDescription,
      ctaGoal:          CTA_GOAL_LABELS[ctaGoal]             ?? ctaGoal,
      tagline,
      problems,
      problemsOther,
      valueFeatures,
      includePricing,
      includeTestimonials,
      additionalNotes,
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
