import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

const DEFAULT_LOGO_SETTINGS = {
  mode: 'TEXT', // 'IMAGE' or 'TEXT'
  imageUrl: '',
  imageWidth: 160,
  imageHeight: 40,
  faviconUrl: '',
  textPrefix: 'KILLA',
  textSuffix: 'SNUS',
  tagline: 'LUXURY POUCHES',
  goldAccent: true,
};

export async function GET() {
  try {
    const setting = await prisma.storeSetting.findUnique({
      where: { key: 'logo_settings' },
    });

    return NextResponse.json({
      logo: setting?.value || DEFAULT_LOGO_SETTINGS,
    });
  } catch (error: any) {
    return NextResponse.json({ logo: DEFAULT_LOGO_SETTINGS });
  }
}

export async function PUT(req: NextRequest) {
  const authRes = await requireAdmin(req);
  if (authRes instanceof NextResponse) return authRes;

  try {
    const body = await req.json();

    const setting = await prisma.storeSetting.upsert({
      where: { key: 'logo_settings' },
      update: { value: body },
      create: { key: 'logo_settings', value: body },
    });

    return NextResponse.json({ success: true, logo: setting.value });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

