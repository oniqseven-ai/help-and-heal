import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from './auth';

export async function requireAdminApi() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return { error: NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 }), session: null };
  }

  const role = (session.user as { role?: string }).role;
  if (role !== 'ADMIN') {
    return { error: NextResponse.json({ success: false, error: 'Forbidden: Admin access required' }, { status: 403 }), session: null };
  }

  return { error: null, session };
}
