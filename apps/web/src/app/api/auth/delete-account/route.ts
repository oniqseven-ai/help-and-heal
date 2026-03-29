import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;

    // Cascade delete handles: wallet, wallet_transactions, sessions,
    // session_messages, ratings, provider, provider_application,
    // compliance_checklist_items
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ success: true, data: { message: 'Account deleted successfully' } });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
