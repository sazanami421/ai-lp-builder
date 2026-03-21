import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import ProjectList from '@/components/dashboard/ProjectList';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  const projects = await prisma.project.findMany({
    where: { userId: session!.user.id },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      updatedAt: true,
      pages: {
        take: 1,
        select: {
          isPublished: true,
          _count: { select: { formSubmissions: true } },
        },
      },
    },
  });

  return <ProjectList projects={projects} />;
}
