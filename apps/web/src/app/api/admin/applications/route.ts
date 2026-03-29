import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin';
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { error } = await requireAdminApi();
    if (error) return error;

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const tier = searchParams.get('tier');
    const search = searchParams.get('search');

    const applications = await prisma.providerApplication.findMany({
      where: {
        ...(status ? { status: status as 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' } : {}),
        ...(tier ? { tier: tier as 'LISTENER' | 'COUNSELOR' | 'PSYCHOLOGIST' | 'PSYCHIATRIST' } : {}),
        ...(search ? { fullName: { contains: search, mode: 'insensitive' as const } } : {}),
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fullName: true,
        displayName: true,
        phone: true,
        tier: true,
        status: true,
        yearsExperience: true,
        requestedRate: true,
        createdAt: true,
        _count: { select: { checklistItems: { where: { isCompleted: true } } } },
        checklistItems: { select: { id: true } },
      },
    });

    const formatted = applications.map((a) => ({
      ...a,
      completedChecks: a._count.checklistItems,
      totalChecks: a.checklistItems.length,
    }));

    return NextResponse.json({ success: true, data: formatted });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
