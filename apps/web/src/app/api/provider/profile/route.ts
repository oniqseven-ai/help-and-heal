import { NextResponse } from 'next/server';
import { requireProviderApi } from '@/lib/provider';
import { prisma } from '@/lib/db';
import { TIER_RATE_RANGES } from '@/lib/compliance';

export async function GET() {
  try {
    const { error, provider } = await requireProviderApi();
    if (error) return error;
    if (!provider) {
      return NextResponse.json({ success: false, error: 'Provider profile not found' }, { status: 404 });
    }

    const rateRange = TIER_RATE_RANGES[provider.tier] || { min: 0, max: 100000 };

    return NextResponse.json({ success: true, data: { ...provider, rateRange } });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { error, provider } = await requireProviderApi();
    if (error) return error;
    if (!provider) {
      return NextResponse.json({ success: false, error: 'Provider profile not found' }, { status: 404 });
    }

    const body = await req.json();
    const { displayName, bio, specialties, languages, ratePerMinute } = body;

    const rateRange = TIER_RATE_RANGES[provider.tier];
    if (ratePerMinute && rateRange && (ratePerMinute < rateRange.min || ratePerMinute > rateRange.max)) {
      return NextResponse.json({
        success: false,
        error: `Rate must be between ${rateRange.label}`,
      }, { status: 400 });
    }

    const updated = await prisma.provider.update({
      where: { id: provider.id },
      data: {
        ...(displayName !== undefined ? { displayName } : {}),
        ...(bio !== undefined ? { bio } : {}),
        ...(specialties !== undefined ? { specialties } : {}),
        ...(languages !== undefined ? { languages } : {}),
        ...(ratePerMinute !== undefined ? { ratePerMinute } : {}),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
