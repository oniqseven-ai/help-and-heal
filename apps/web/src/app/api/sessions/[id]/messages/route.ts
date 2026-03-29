import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const after = searchParams.get('after'); // ISO timestamp for polling

  const messages = await prisma.sessionMessage.findMany({
    where: {
      sessionId: id,
      ...(after ? { createdAt: { gt: new Date(after) } } : {}),
    },
    orderBy: { createdAt: 'asc' },
  });

  return NextResponse.json({ success: true, data: messages });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const { content, senderType } = await req.json();

  if (!content?.trim()) {
    return NextResponse.json({ success: false, error: 'Message cannot be empty' }, { status: 400 });
  }

  // Verify session exists and is active
  const chatSession = await prisma.session.findUnique({ where: { id } });
  if (!chatSession || chatSession.status !== 'ACTIVE') {
    return NextResponse.json({ success: false, error: 'Session is not active' }, { status: 400 });
  }

  const message = await prisma.sessionMessage.create({
    data: {
      sessionId: id,
      senderType: senderType || 'USER',
      content: content.trim(),
    },
  });

  return NextResponse.json({ success: true, data: message });
}
