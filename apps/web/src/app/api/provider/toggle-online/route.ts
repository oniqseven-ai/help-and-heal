import { NextResponse } from 'next/server';
import { requireProviderApi } from '@/lib/provider';
import { prisma } from '@/lib/db';

export async function POST() {
  try {
    const { error, provider } = await requireProviderApi();
    if (error) return error;
    if (!provider) {
      return NextResponse.json({ success: false, error: 'Provider not found' }, { status: 404 });
    }

    const updated = await prisma.provider.update({
      where: { id: provider.id },
      data: { isOnline: !provider.isOnline },
    });

    return NextResponse.json({ success: true, data: { isOnline: updated.isOnline } });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
