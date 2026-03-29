import { NextResponse } from 'next/server';
import { requireProviderApi } from '@/lib/provider';
import { prisma } from '@/lib/db';

export async function GET() {
  const { error, provider } = await requireProviderApi();
  if (error) return error;
  if (!provider) {
    return NextResponse.json({ success: false, error: 'Provider not found' }, { status: 404 });
  }

  const [ratingDist, sessionStats, completedSessions, cancelledCount, recentFeedback] = await Promise.all([
    prisma.rating.groupBy({
      by: ['score'],
      where: { providerId: provider.id },
      _count: true,
    }),
    prisma.session.aggregate({
      where: { providerId: provider.id, status: 'COMPLETED' },
      _avg: { durationSeconds: true },
      _count: true,
    }),
    prisma.session.findMany({
      where: { providerId: provider.id, status: 'COMPLETED' },
      select: { userId: true },
    }),
    prisma.session.count({
      where: { providerId: provider.id, status: 'CANCELLED' },
    }),
    prisma.rating.findMany({
      where: { providerId: provider.id, feedback: { not: null } },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: { score: true, feedback: true, createdAt: true },
    }),
  ]);

  // Rating distribution
  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  ratingDist.forEach((r) => { distribution[r.score] = r._count; });

  // Repeat user %
  const userCounts: Record<string, number> = {};
  completedSessions.forEach((s) => { userCounts[s.userId] = (userCounts[s.userId] || 0) + 1; });
  const uniqueUsers = Object.keys(userCounts).length;
  const repeatUsers = Object.values(userCounts).filter((c) => c > 1).length;
  const repeatPct = uniqueUsers > 0 ? Math.round((repeatUsers / uniqueUsers) * 100) : 0;

  // Completion rate
  const completed = sessionStats._count;
  const totalAttempted = completed + cancelledCount;
  const completionRate = totalAttempted > 0 ? Math.round((completed / totalAttempted) * 100) : 100;

  return NextResponse.json({
    success: true,
    data: {
      ratingAvg: provider.ratingAvg,
      ratingDistribution: distribution,
      totalSessions: provider.totalSessions,
      totalMinutes: provider.totalMinutes,
      avgSessionDuration: Math.round(sessionStats._avg.durationSeconds || 0),
      repeatUserPct: repeatPct,
      completionRate,
      uniqueUsers,
      recentFeedback,
    },
  });
}
