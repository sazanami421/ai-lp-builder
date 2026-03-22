import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { formSubmissionSchema, formatZodError } from '@/lib/validations';
import { handleApiError, NotFound } from '@/lib/errors';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = formSubmissionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: formatZodError(parsed.error) },
        { status: 400 }
      );
    }

    const { pageId, data } = parsed.data;

    // ページが公開中か確認
    const page = await prisma.page.findFirst({
      where: { id: pageId, isPublished: true },
    });

    if (!page) {
      throw NotFound('ページが見つかりません');
    }

    await prisma.formSubmission.create({
      data: { pageId, data: data as Prisma.InputJsonValue },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    return handleApiError(err, 'POST /api/form');
  }
}
