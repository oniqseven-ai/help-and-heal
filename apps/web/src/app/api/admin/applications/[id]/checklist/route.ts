import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin';
import { prisma } from '@/lib/db';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error, session } = await requireAdminApi();
  if (error) return error;

  const { id } = await params;
  const { key, isCompleted, notes } = await req.json();

  const adminId = (session!.user as { id: string }).id;

  const item = await prisma.complianceChecklistItem.findUnique({
    where: { applicationId_key: { applicationId: id, key } },
  });

  if (!item) {
    return NextResponse.json({ success: false, error: 'Checklist item not found' }, { status: 404 });
  }

  const updated = await prisma.complianceChecklistItem.update({
    where: { id: item.id },
    data: {
      isCompleted,
      completedBy: isCompleted ? adminId : null,
      completedAt: isCompleted ? new Date() : null,
      ...(notes !== undefined ? { notes } : {}),
    },
  });

  return NextResponse.json({ success: true, data: updated });
}
