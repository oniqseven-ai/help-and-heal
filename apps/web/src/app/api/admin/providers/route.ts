import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin';
import { prisma } from '@/lib/db';

export async function GET() {
  const { error } = await requireAdminApi();
  if (error) return error;

  const providers = await prisma.provider.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { phone: true, email: true } } },
  });

  return NextResponse.json({ success: true, data: providers });
}
