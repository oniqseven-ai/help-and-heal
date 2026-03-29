import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getChecklistForTier } from '@/lib/compliance';
import { encryptField } from '@/lib/api-utils';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Please log in first' }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const data = await req.json();

    // Check for existing application
    const existing = await prisma.providerApplication.findUnique({ where: { userId } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'You already have an application. Check your application status.' },
        { status: 409 },
      );
    }

    // Validate required fields
    if (!data.fullName || !data.displayName || !data.phone || !data.tier) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }
    if (!data.specialties?.length || !data.languages?.length) {
      return NextResponse.json({ success: false, error: 'Specialties and languages are required' }, { status: 400 });
    }
    if (!data.requestedRate || data.requestedRate <= 0) {
      return NextResponse.json({ success: false, error: 'A valid rate per minute is required' }, { status: 400 });
    }

    const checklistDefs = getChecklistForTier(data.tier);

    const application = await prisma.providerApplication.create({
      data: {
        userId,
        status: 'SUBMITTED',
        fullName: data.fullName,
        displayName: data.displayName,
        phone: data.phone,
        email: data.email || null,
        dateOfBirth: data.dateOfBirth || null,
        gender: data.gender || null,
        tier: data.tier,
        bio: data.bio || '',
        specialties: data.specialties || [],
        languages: data.languages || [],
        requestedRate: data.requestedRate,
        yearsExperience: data.yearsExperience || 0,
        governmentIdType: data.governmentIdType || null,
        governmentIdNumber: data.governmentIdNumber ? encryptField(data.governmentIdNumber) : null,
        aadhaarNumber: data.aadhaarNumber ? encryptField(data.aadhaarNumber) : null,
        panNumber: data.panNumber ? encryptField(data.panNumber) : null,
        highestDegree: data.highestDegree || null,
        university: data.university || null,
        graduationYear: data.graduationYear ? parseInt(data.graduationYear) : null,
        degreeCertNumber: data.degreeCertNumber || null,
        rciRegistrationNo: data.rciRegistrationNo || null,
        nmcRegistrationNo: data.nmcRegistrationNo || null,
        hasIndemnityInsurance: data.hasIndemnityInsurance || false,
        insurancePolicyNumber: data.insurancePolicyNumber || null,
        codeOfEthicsAgreed: data.codeOfEthicsAgreed || false,
        dpdpConsentAgreed: data.dpdpConsentAgreed || false,
        termsAgreed: data.termsAgreed || false,
        checklistItems: {
          create: checklistDefs.map((item) => ({
            key: item.key,
            label: item.label,
            isRequired: item.isRequired,
            isCompleted: false,
          })),
        },
      },
    });

    // Update user role
    await prisma.user.update({
      where: { id: userId },
      data: { role: 'PROVIDER' },
    });

    return NextResponse.json({ success: true, data: { id: application.id } });
  } catch (error) {
    console.error('Provider application error:', error);
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 },
    );
  }
}
