import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const provider = await prisma.provider.findUnique({
    where: { id },
    include: {
      ratings: {
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: { score: true, feedback: true, createdAt: true },
      },
    },
  });

  if (!provider) {
    return NextResponse.json(
      { success: false, error: 'Provider not found' },
      { status: 404 },
    );
  }

  return NextResponse.json({ success: true, data: provider });
}
