import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const { error } = await requireAdminApi();
    if (error) return error;

    const [applications, providers] = await Promise.all([
      prisma.providerApplication.groupBy({
        by: ['status'],
        _count: true,
      }),
      prisma.provider.groupBy({
        by: ['tier'],
        _count: true,
      }),
    ]);

    const statusCounts: Record<string, number> = {};
    applications.forEach((a) => { statusCounts[a.status] = a._count; });

    const tierCounts: Record<string, number> = {};
    providers.forEach((p) => { tierCounts[p.tier] = p._count; });

    const recentApplications = await prisma.providerApplication.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        fullName: true,
        tier: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: { statusCounts, tierCounts, recentApplications },
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
