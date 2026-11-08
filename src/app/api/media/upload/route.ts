import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { uploadToR2 } from '@/lib/r2';

export async function POST(req: NextRequest) {
  const authRes = await requireAdmin(req);
  if (authRes instanceof NextResponse) return authRes;

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'products';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename and create unique R2 key
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const key = `${folder}/${Date.now()}-${sanitizedName}`;

    const { url, key: r2Key } = await uploadToR2({
      fileBuffer: buffer,
      key,
      contentType: file.type || 'application/octet-stream',
    });

    const media = await prisma.mediaItem.create({
      data: {
        name: file.name,
        url,
        r2Key,
        size: file.size,
        mimeType: file.type || 'image/jpeg',
        folder,
        altText: file.name.split('.')[0],
      },
    });

    return NextResponse.json({ media }, { status: 201 });
  } catch (error: any) {
    console.error('API Media Upload error:', error);
    return NextResponse.json({ error: error.message || 'Media upload failed' }, { status: 500 });
  }
}

