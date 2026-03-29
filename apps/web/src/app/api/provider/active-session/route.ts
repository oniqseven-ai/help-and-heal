import { NextResponse } from 'next/server';
import { requireProviderApi } from '@/lib/provider';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const { error, provider } = await requireProviderApi();
    if (error) return error;
    if (!provider) {
      return NextResponse.json({ success: false, error: 'Provider not found' }, { status: 404 });
    }

    const activeSession = await prisma.session.findFirst({
      where: {
        providerId: provider.id,
        status: { in: ['WAITING', 'ACTIVE'] },
      },
      include: {
        messages: { orderBy: { createdAt: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: activeSession });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
