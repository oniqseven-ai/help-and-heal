import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;

  const sessions = await prisma.session.findMany({
    where: { userId },
    include: {
      provider: { select: { displayName: true } },
      rating: { select: { score: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  return NextResponse.json({ success: true, data: sessions });
}
