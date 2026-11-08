import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID || '';
const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || '';
const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '';
const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME || 'killasnus-media';
const publicDomain =
  process.env.NEXT_PUBLIC_R2_PUBLIC_URL ||
  (accountId ? `https://${bucketName}.${accountId}.r2.cloudflarestorage.com` : '');

export function getR2Client(): S3Client {
  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

export async function uploadToR2({
  fileBuffer,
  key,
  contentType,
}: {
  fileBuffer: Buffer;
  key: string;
  contentType: string;
}): Promise<{ url: string; key: string }> {
  // If R2 credentials aren't configured yet, fallback gracefully for dev/demo uploads
  if (!accountId || !accessKeyId || !secretAccessKey) {
    console.warn('Cloudflare R2 credentials not fully configured. Using data URL fallback.');
    const base64 = fileBuffer.toString('base64');
    return {
      url: `data:${contentType};base64,${base64}`,
      key: `local-${key}`,
    };
  }

  const s3 = getR2Client();
  await s3.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
    })
  );

  const url = publicDomain ? `${publicDomain.replace(/\/$/, '')}/${key}` : `/${key}`;
  return { url, key };
}

export async function deleteFromR2(key: string): Promise<boolean> {
  if (!accountId || !accessKeyId || !secretAccessKey) {
    return true;
  }
  try {
    const s3 = getR2Client();
    await s3.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key,
      })
    );
    return true;
  } catch (error) {
    console.error('Failed to delete object from R2:', error);
    return false;
  }
}

export async function getPresignedUploadUrl(
  key: string,
  contentType: string,
  expiresInSeconds = 3600
): Promise<string | null> {
  if (!accountId || !accessKeyId || !secretAccessKey) return null;
  const s3 = getR2Client();
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: contentType,
  });
  return await getSignedUrl(s3, command, { expiresIn: expiresInSeconds });
}

