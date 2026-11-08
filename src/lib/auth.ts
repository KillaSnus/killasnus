import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';
import prisma from '@/lib/prisma';
import { Role } from '@prisma/client';

export interface AuthSession {
  uid: string;
  email: string;
  role: Role;
  dbUserId: string;
  name?: string | null;
}

export async function getSession(req: NextRequest): Promise<AuthSession | null> {
  // 1. Check for Admin API key header (convenient for setup/seed/CLI automation)
  const apiKey = req.headers.get('x-admin-api-key');
  if (apiKey && process.env.ADMIN_API_KEY && apiKey === process.env.ADMIN_API_KEY) {
    let adminUser = await prisma.user.findFirst({
      where: { role: Role.ADMIN },
    });
    if (!adminUser) {
      adminUser = await prisma.user.create({
        data: {
          firebaseUid: 'admin-master-uid',
          email: process.env.ADMIN_EMAIL || 'admin@killasnus.com',
          name: 'Super Admin',
          role: Role.ADMIN,
        },
      });
    }
    return {
      uid: adminUser.firebaseUid,
      email: adminUser.email,
      role: Role.ADMIN,
      dbUserId: adminUser.id,
      name: adminUser.name,
    };
  }

  // 2. Extract Firebase Bearer token or session cookie
  const authHeader = req.headers.get('authorization');
  let token: string | null = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else {
    const sessionCookie = req.cookies.get('kns_session')?.value;
    if (sessionCookie) token = sessionCookie;
  }

  if (!token) return null;

  try {
    const decodedToken = await adminAuth().verifyIdToken(token);
    const { uid, email, name, picture } = decodedToken;

    if (!email) return null;

    // Synchronize or find user in Postgres
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      const isDefaultAdmin =
        email === (process.env.ADMIN_EMAIL || 'admin@killasnus.com') ||
        email.endsWith('@killasnus.com');

      user = await prisma.user.create({
        data: {
          firebaseUid: uid,
          email,
          name: name || email.split('@')[0],
          avatar: picture,
          role: isDefaultAdmin ? Role.ADMIN : Role.CUSTOMER,
        },
      });
    } else if (user.firebaseUid !== uid) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { firebaseUid: uid },
      });
    }

    return {
      uid: user.firebaseUid,
      email: user.email,
      role: user.role,
      dbUserId: user.id,
      name: user.name,
    };
  } catch (error) {
    console.error('Session verification error:', error);
    return null;
  }
}

export async function requireAuth(req: NextRequest): Promise<{ session: AuthSession } | NextResponse> {
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 });
  }
  return { session };
}

export async function requireAdmin(req: NextRequest): Promise<{ session: AuthSession } | NextResponse> {
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 });
  }
  if (session.role !== Role.ADMIN && session.role !== Role.MANAGER) {
    return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
  }
  return { session };
}

