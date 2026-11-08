import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';
import prisma from '@/lib/prisma';
import { Role } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing or invalid token' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = await adminAuth().verifyIdToken(token);
    const { uid, email } = decoded;

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const body = await req.json().catch(() => ({}));
    const name = body.name || decoded.name || email.split('@')[0];
    const avatar = body.avatar || decoded.picture;

    const isDefaultAdmin =
      email === (process.env.ADMIN_EMAIL || 'admin@killasnus.com') ||
      email.endsWith('@killasnus.com');

    const user = await prisma.user.upsert({
      where: { email },
      update: {
        firebaseUid: uid,
        name: name || undefined,
        avatar: avatar || undefined,
      },
      create: {
        firebaseUid: uid,
        email,
        name,
        avatar,
        role: isDefaultAdmin ? Role.ADMIN : Role.CUSTOMER,
      },
    });

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error('Error syncing auth user:', error);
    return NextResponse.json({ error: error.message || 'Auth sync failed' }, { status: 500 });
  }
}

