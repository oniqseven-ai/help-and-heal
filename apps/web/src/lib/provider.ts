import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from './auth';
import { prisma } from './db';

export async function requireProviderApi() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return { error: NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 }), session: null, provider: null };
  }

  const role = (session.user as { role?: string }).role;
  if (role !== 'PROVIDER' && role !== 'ADMIN') {
    return { error: NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 }), session: null, provider: null };
  }

  const userId = (session.user as { id: string }).id;
  const provider = await prisma.provider.findUnique({ where: { userId } });

  return { error: null, session, provider };
}
