import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const { error } = await requireAdminApi();
    if (error) return error;

    const providers = await prisma.provider.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { phone: true, email: true } } },
    });

    return NextResponse.json({ success: true, data: providers });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
