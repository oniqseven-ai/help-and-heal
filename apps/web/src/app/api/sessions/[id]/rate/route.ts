import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const { id } = await params;
  const { score, feedback } = await req.json();

  if (!score || score < 1 || score > 5) {
    return NextResponse.json({ success: false, error: 'Rating must be 1-5' }, { status: 400 });
  }

  const chatSession = await prisma.session.findUnique({ where: { id } });
  if (!chatSession) {
    return NextResponse.json({ success: false, error: 'Session not found' }, { status: 404 });
  }

  // Check if already rated
  const existing = await prisma.rating.findUnique({ where: { sessionId: id } });
  if (existing) {
    return NextResponse.json({ success: false, error: 'Already rated' }, { status: 409 });
  }

  // Create rating
  const rating = await prisma.rating.create({
    data: {
      sessionId: id,
      userId,
      providerId: chatSession.providerId,
      score,
      feedback: feedback || null,
    },
  });

  // Update provider average rating
  const avgResult = await prisma.rating.aggregate({
    where: { providerId: chatSession.providerId },
    _avg: { score: true },
  });

  await prisma.provider.update({
    where: { id: chatSession.providerId },
    data: { ratingAvg: avgResult._avg.score || 0 },
  });

  return NextResponse.json({ success: true, data: rating });
}
