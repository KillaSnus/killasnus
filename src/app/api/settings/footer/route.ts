import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

const DEFAULT_FOOTER_SETTINGS = {
  aboutText:
    'The premier destination for authentic Scandinavian nicotine pouches. Tobacco-free, smoke-free, and spit-free. Direct delivery from certified European manufacturers.',
  copyrightText: `© ${new Date().getFullYear()} KILLASNUS. All rights reserved. Original Design.`,
  disclaimerText:
    'This product contains nicotine. Nicotine is an addictive chemical. Not suitable for individuals under 18 years of age, pregnant or breastfeeding women, or people with cardiovascular disease. Keep out of reach of children and pets.',
  supportEmail: 'support@killasnus.com',
  newsletterTitle: 'Unlock 10% Off Your First Order',
  newsletterSubtitle: 'Get early access to limited batch drops, exclusive subscriber flash sales, and new flavour releases.',
  socialLinks: {
    instagram: 'https://instagram.com',
    twitter: 'https://x.com',
    telegram: 'https://t.me',
    whatsapp: 'https://whatsapp.com',
  },
  paymentBadges: ['VISA', 'Mastercard', 'Apple Pay', 'PayPal', 'Crypto'],
};

export async function GET() {
  try {
    const setting = await prisma.storeSetting.findUnique({
      where: { key: 'footer_settings' },
    });

    return NextResponse.json({
      footer: setting?.value || DEFAULT_FOOTER_SETTINGS,
    });
  } catch (error: any) {
    return NextResponse.json({ footer: DEFAULT_FOOTER_SETTINGS });
  }
}

export async function PUT(req: NextRequest) {
  const authRes = await requireAdmin(req);
  if (authRes instanceof NextResponse) return authRes;

  try {
    const body = await req.json();

    const setting = await prisma.storeSetting.upsert({
      where: { key: 'footer_settings' },
      update: { value: body },
      create: { key: 'footer_settings', value: body },
    });

    return NextResponse.json({ success: true, footer: setting.value });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

