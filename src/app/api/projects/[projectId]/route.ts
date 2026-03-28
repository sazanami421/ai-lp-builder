import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { handleApiError, NotFound, Forbidden } from '@/lib/errors';
import { updateProjectSchema } from '@/lib/validations';
import { formatZodError } from '@/lib/validations';

type Params = { params: Promise<{ projectId: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }

  try {
    const { projectId } = await params;
    const body = await req.json();
    const parsed = updateProjectSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 });
    }

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw NotFound('プロジェクトが見つかりません');
    if (project.userId !== session.user.id) throw Forbidden();

    const updated = await prisma.project.update({
      where: { id: projectId },
      data: { name: parsed.data.name },
    });

    return NextResponse.json({ id: updated.id, name: updated.name });
  } catch (err) {
    return handleApiError(err, 'PATCH /api/projects/[projectId]');
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }

  try {
    const { projectId } = await params;

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw NotFound('プロジェクトが見つかりません');
    if (project.userId !== session.user.id) throw Forbidden();

    await prisma.project.delete({ where: { id: projectId } });

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return handleApiError(err, 'DELETE /api/projects/[projectId]');
  }
}
