import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;

    const [application, provider] = await Promise.all([
      prisma.providerApplication.findUnique({
        where: { userId },
        select: { status: true, rejectionReason: true, tier: true, createdAt: true },
      }),
      prisma.provider.findUnique({
        where: { userId },
        select: { id: true, displayName: true, isOnline: true, isVerified: true },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        applicationStatus: application?.status || null,
        rejectionReason: application?.rejectionReason || null,
        hasProviderRecord: !!provider,
        provider,
      },
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
