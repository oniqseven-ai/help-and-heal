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

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const { providerId, type, moodBefore, topic } = await req.json();

  // Validate provider exists and is online
  const provider = await prisma.provider.findUnique({ where: { id: providerId } });
  if (!provider) {
    return NextResponse.json({ success: false, error: 'Provider not found' }, { status: 404 });
  }
  if (!provider.isOnline) {
    return NextResponse.json({ success: false, error: 'Provider is currently offline' }, { status: 400 });
  }

  // Create session
  const newSession = await prisma.session.create({
    data: {
      userId,
      providerId: provider.id,
      type: type || 'CHAT',
      status: 'WAITING',
      ratePerMinute: provider.ratePerMinute,
      isFreeTrial: true, // Free during beta
      moodBefore: moodBefore || null,
    },
  });

  // Save topic as first system message if provided
  if (topic) {
    await prisma.sessionMessage.create({
      data: {
        sessionId: newSession.id,
        senderType: 'SYSTEM',
        content: `Topic: ${topic}`,
      },
    });
  }

  return NextResponse.json({ success: true, data: newSession });
}
