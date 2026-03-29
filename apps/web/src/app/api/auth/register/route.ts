import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { checkRateLimit } from '@/lib/api-utils';

export async function POST(req: Request) {
  try {
    // Rate limit: 5 registrations per IP per minute
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(`register:${ip}`, 5, 60000)) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again later.' },
        { status: 429 },
      );
    }

    const { name, phone, password, language } = await req.json();

    if (!phone || !password) {
      return NextResponse.json(
        { success: false, error: 'Phone and password are required' },
        { status: 400 },
      );
    }

    if (phone.length !== 10) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid 10-digit phone number' },
        { status: 400 },
      );
    }

    const existing = await prisma.user.findUnique({ where: { phone } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'An account with this phone number already exists' },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        phone,
        name: name || null,
        passwordHash,
        languagePreference: language === 'hi' ? 'hi' : 'en',
        wallet: {
          create: { balance: 0 },
        },
      },
      include: { wallet: true },
    });

    return NextResponse.json({
      success: true,
      data: { id: user.id, name: user.name, phone: user.phone },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 },
    );
  }
}
