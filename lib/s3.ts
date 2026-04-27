import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION || 'ru-1',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
  forcePathStyle: true,
})

export const BUCKET = process.env.S3_BUCKET!
export const PUBLIC_URL = process.env.S3_PUBLIC_URL!

export async function getUploadUrl(path: string, contentType: string) {
  const cmd = new PutObjectCommand({
    Bucket: BUCKET,
    Key: path,
    ContentType: contentType,
    ACL: 'public-read',
  })
  const signedUrl = await getSignedUrl(s3, cmd, { expiresIn: 300 })
  const publicUrl = `${PUBLIC_URL}/${path}`
  return { signedUrl, publicUrl }
}
