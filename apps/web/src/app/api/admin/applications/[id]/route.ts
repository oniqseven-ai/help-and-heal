import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin';
import { prisma } from '@/lib/db';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requireAdminApi();
  if (error) return error;

  const { id } = await params;

  const application = await prisma.providerApplication.findUnique({
    where: { id },
    include: {
      checklistItems: { orderBy: { key: 'asc' } },
      user: { select: { name: true, phone: true, email: true, createdAt: true } },
    },
  });

  if (!application) {
    return NextResponse.json({ success: false, error: 'Application not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: application });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error, session } = await requireAdminApi();
  if (error) return error;

  const { id } = await params;
  const body = await req.json();
  const { status, reviewNotes, rejectionReason } = body;

  const application = await prisma.providerApplication.findUnique({
    where: { id },
    include: { checklistItems: true },
  });

  if (!application) {
    return NextResponse.json({ success: false, error: 'Application not found' }, { status: 404 });
  }

  const adminId = (session!.user as { id: string }).id;

  // Validate state transitions
  const validTransitions: Record<string, string[]> = {
    DRAFT: ['SUBMITTED'],
    SUBMITTED: ['UNDER_REVIEW', 'APPROVED', 'REJECTED'],
    UNDER_REVIEW: ['APPROVED', 'REJECTED', 'RESUBMISSION_REQUESTED'],
    APPROVED: [],
    REJECTED: [],
    RESUBMISSION_REQUESTED: ['SUBMITTED'],
  };

  if (!validTransitions[application.status]?.includes(status)) {
    return NextResponse.json({
      success: false,
      error: `Cannot change status from ${application.status} to ${status}`,
    }, { status: 400 });
  }

  if (status === 'REJECTED' && !rejectionReason) {
    return NextResponse.json({ success: false, error: 'Rejection reason is required' }, { status: 400 });
  }

  // If approving, validate data and create Provider atomically
  if (status === 'APPROVED') {
    const incomplete = application.checklistItems.filter((c) => c.isRequired && !c.isCompleted);
    if (incomplete.length > 0) {
      return NextResponse.json({
        success: false,
        error: `Cannot approve: ${incomplete.length} required checklist items are incomplete`,
      }, { status: 400 });
    }

    if (!application.displayName || application.specialties.length === 0 || application.languages.length === 0 || application.requestedRate <= 0) {
      return NextResponse.json({
        success: false,
        error: 'Application data is incomplete. Please check display name, specialties, languages, and rate.',
      }, { status: 400 });
    }

    // Atomic transaction: create Provider + update application status
    const updated = await prisma.$transaction(async (tx) => {
      await tx.provider.create({
        data: {
          userId: application.userId,
          tier: application.tier,
          displayName: application.displayName,
          bio: application.bio,
          specialties: application.specialties,
          languages: application.languages,
          ratePerMinute: application.requestedRate,
          isVerified: true,
          isOnline: false,
        },
      });

      return tx.providerApplication.update({
        where: { id },
        data: {
          status: 'APPROVED',
          reviewedBy: adminId,
          reviewedAt: new Date(),
          ...(reviewNotes ? { reviewNotes } : {}),
        },
      });
    });

    return NextResponse.json({ success: true, data: updated });
  }

  // For non-approval status changes
  const updated = await prisma.providerApplication.update({
    where: { id },
    data: {
      status,
      reviewedBy: adminId,
      reviewedAt: new Date(),
      ...(reviewNotes ? { reviewNotes } : {}),
      ...(rejectionReason ? { rejectionReason } : {}),
    },
  });

  return NextResponse.json({ success: true, data: updated });
}
