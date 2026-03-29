import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const { id } = await params;

    const chatSession = await prisma.session.findUnique({
      where: { id },
      include: {
        provider: { select: { id: true, displayName: true, tier: true, ratePerMinute: true } },
        rating: { select: { score: true, feedback: true } },
      },
    });

    if (!chatSession) {
      return NextResponse.json({ success: false, error: 'Session not found' }, { status: 404 });
    }

    // Verify the user is either the session user or the session provider
    if (chatSession.userId !== userId && chatSession.provider.id !== userId) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ success: true, data: chatSession });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const { id } = await params;
    const { status, moodAfter } = await req.json();

    const chatSession = await prisma.session.findUnique({
      where: { id },
      include: {
        provider: { select: { id: true } },
      },
    });
    if (!chatSession) {
      return NextResponse.json({ success: false, error: 'Session not found' }, { status: 404 });
    }

    // Verify the user is either the session user or the session provider
    if (chatSession.userId !== userId && chatSession.provider.id !== userId) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const updateData: Record<string, unknown> = {};

    if (status === 'ACTIVE' && chatSession.status === 'WAITING') {
      updateData.status = 'ACTIVE';
      updateData.startedAt = new Date();
    } else if (status === 'COMPLETED' && chatSession.status === 'ACTIVE') {
      const now = new Date();
      const startedAt = chatSession.startedAt || now;
      const durationSeconds = Math.round((now.getTime() - startedAt.getTime()) / 1000);
      const totalCharged = chatSession.isFreeTrial ? 0 : Math.ceil(durationSeconds / 60) * chatSession.ratePerMinute;

      updateData.status = 'COMPLETED';
      updateData.endedAt = now;
      updateData.durationSeconds = durationSeconds;
      updateData.totalCharged = totalCharged;

      // Update provider stats
      await prisma.provider.update({
        where: { id: chatSession.providerId },
        data: {
          totalSessions: { increment: 1 },
          totalMinutes: { increment: Math.ceil(durationSeconds / 60) },
        },
      });
    } else if (status === 'CANCELLED') {
      updateData.status = 'CANCELLED';
      updateData.endedAt = new Date();
    }

    if (moodAfter !== undefined) {
      updateData.moodAfter = moodAfter;
    }

    const updated = await prisma.session.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
