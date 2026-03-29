import { NextResponse } from 'next/server';
import { requireProviderApi } from '@/lib/provider';
import { prisma } from '@/lib/db';
import crypto from 'crypto';

export async function GET() {
  try {
    const { error, provider } = await requireProviderApi();
    if (error) return error;
    if (!provider) {
      return NextResponse.json({ success: false, error: 'Provider not found' }, { status: 404 });
    }

    const sessions = await prisma.session.findMany({
      where: { providerId: provider.id },
      include: {
        rating: { select: { score: true, feedback: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    // Anonymize user IDs
    const anonymized = sessions.map((s) => ({
      id: s.id,
      userAnon: `User #${crypto.createHash('sha256').update(s.userId).digest('hex').slice(0, 6)}`,
      type: s.type,
      status: s.status,
      startedAt: s.startedAt,
      endedAt: s.endedAt,
      durationSeconds: s.durationSeconds,
      grossEarnings: s.totalCharged,
      netEarnings: Math.round(s.totalCharged * 0.70),
      ratingScore: s.rating?.score || null,
      feedback: s.rating?.feedback || null,
      createdAt: s.createdAt,
    }));

    return NextResponse.json({ success: true, data: anonymized });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
