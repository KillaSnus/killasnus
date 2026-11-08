import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://killasnus.com';

  const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/
Disallow: /account/
Disallow: /checkout/
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml
`;

  return new NextResponse(robots, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}

