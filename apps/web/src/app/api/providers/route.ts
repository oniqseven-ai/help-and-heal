import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tier = searchParams.get('tier');
  const specialty = searchParams.get('specialty');
  const language = searchParams.get('language');
  const search = searchParams.get('search');

  const providers = await prisma.provider.findMany({
    where: {
      ...(tier ? { tier: tier as 'LISTENER' | 'COUNSELOR' | 'PSYCHOLOGIST' } : {}),
      ...(specialty ? { specialties: { has: specialty } } : {}),
      ...(language ? { languages: { has: language } } : {}),
      ...(search
        ? {
            OR: [
              { displayName: { contains: search, mode: 'insensitive' as const } },
              { specialties: { has: search.toLowerCase() } },
            ],
          }
        : {}),
    },
    orderBy: [{ isOnline: 'desc' }, { ratingAvg: 'desc' }],
  });

  return NextResponse.json({ success: true, data: providers });
}
