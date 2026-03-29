import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { encryptField, decryptField } from '@/lib/api-utils';

export async function GET(
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

    // Verify the user is either the session user or the session provider
    const chatSession = await prisma.session.findUnique({
      where: { id },
      include: { provider: { select: { id: true } } },
    });

    if (!chatSession) {
      return NextResponse.json({ success: false, error: 'Session not found' }, { status: 404 });
    }

    if (chatSession.userId !== userId && chatSession.provider.id !== userId) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const after = searchParams.get('after'); // ISO timestamp for polling

    const messages = await prisma.sessionMessage.findMany({
      where: {
        sessionId: id,
        ...(after ? { createdAt: { gt: new Date(after) } } : {}),
      },
      orderBy: { createdAt: 'asc' },
    });

    // Decrypt messages for response
    const decrypted = messages.map((m) => ({
      ...m,
      content: decryptField(m.content),
    }));

    return NextResponse.json({ success: true, data: decrypted });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
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
    const { content, senderType } = await req.json();

    if (!content?.trim()) {
      return NextResponse.json({ success: false, error: 'Message cannot be empty' }, { status: 400 });
    }

    // Verify session exists, is active, and user is a participant
    const chatSession = await prisma.session.findUnique({
      where: { id },
      include: { provider: { select: { id: true } } },
    });

    if (!chatSession) {
      return NextResponse.json({ success: false, error: 'Session not found' }, { status: 404 });
    }

    if (chatSession.userId !== userId && chatSession.provider.id !== userId) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    if (chatSession.status !== 'ACTIVE') {
      return NextResponse.json({ success: false, error: 'Session is not active' }, { status: 400 });
    }

    const message = await prisma.sessionMessage.create({
      data: {
        sessionId: id,
        senderType: senderType || 'USER',
        content: encryptField(content.trim()),
      },
    });

    return NextResponse.json({ success: true, data: message });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
