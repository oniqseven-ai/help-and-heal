import { NextResponse } from 'next/server';
import { requireProviderApi } from '@/lib/provider';
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { error, provider } = await requireProviderApi();
    if (error) return error;
    if (!provider) {
      return NextResponse.json({ success: false, error: 'Provider not found' }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const period = searchParams.get('period') || 'all';

    const now = new Date();
    let dateFilter: Date | undefined;

    if (period === 'today') {
      dateFilter = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (period === 'week') {
      const d = new Date(now);
      d.setDate(d.getDate() - 7);
      dateFilter = d;
    } else if (period === 'month') {
      const d = new Date(now);
      d.setMonth(d.getMonth() - 1);
      dateFilter = d;
    }

    const where = {
      providerId: provider.id,
      status: 'COMPLETED' as const,
      ...(dateFilter ? { createdAt: { gte: dateFilter } } : {}),
    };

    const [aggregate, sessions] = await Promise.all([
      prisma.session.aggregate({
        where,
        _sum: { totalCharged: true, durationSeconds: true },
        _count: true,
      }),
      prisma.session.findMany({
        where,
        select: {
          id: true,
          type: true,
          durationSeconds: true,
          totalCharged: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
    ]);

    const gross = aggregate._sum.totalCharged || 0;
    const net = Math.round(gross * 0.70);
    const commission = gross - net;
    const totalMinutes = Math.round((aggregate._sum.durationSeconds || 0) / 60);

    const perSession = sessions.map((s) => ({
      id: s.id,
      type: s.type,
      durationSeconds: s.durationSeconds,
      gross: s.totalCharged,
      commission: Math.round(s.totalCharged * 0.30),
      net: Math.round(s.totalCharged * 0.70),
      createdAt: s.createdAt,
    }));

    return NextResponse.json({
      success: true,
      data: {
        period,
        gross,
        net,
        commission,
        sessionCount: aggregate._count,
        totalMinutes,
        sessions: perSession,
      },
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
