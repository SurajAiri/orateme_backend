const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const BUCKETS = {
  audio: 'audios-orateme',
  video: 'videos-orateme', 
  profile: 'profiles-orateme'
};

const b2Client = new S3Client({
  region: 'us-east-005',
  endpoint: 'https://s3.us-east-005.backblazeb2.com',
  credentials: {
    accessKeyId: process.env.B2_KEY_ID,
    secretAccessKey: process.env.B2_APPLICATION_KEY,
  },
  forcePathStyle: true
});

function getBucketDetails(intent) {
  switch(intent) {
    case 'audio':
      return { 
        bucketName: BUCKETS.audio, 
        contentType: 'audio/mpeg', 
        extension: '.mp3' 
      };
    case 'video':
      return { 
        bucketName: BUCKETS.video, 
        contentType: 'video/mp4', 
        extension: '.webm' 
      };
    case 'profile':
      return { 
        bucketName: BUCKETS.profile, 
        contentType: 'image/jpeg', 
        extension: '.jpg' 
      };
    default:
      throw new Error(`Invalid intent: ${intent}`);
  }
}

async function generateB2FileUploadUrl(intent, uniqueId) {
  try {
    const { bucketName, contentType, extension } = getBucketDetails(intent);
    const key = `${uniqueId}${extension}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(b2Client, command, { expiresIn: 180 });
    return { uploadUrl, key };
  } catch (error) {
    console.error('Upload URL Generation Error:', error);
    throw error;
  }
}

async function getB2FileUrl(intent, uniqueId) {
  try {
    const { bucketName, extension } = getBucketDetails(intent);
    const key = `${uniqueId}${extension}`;

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    const signedUrl = await getSignedUrl(b2Client, command, { expiresIn: 3600 });
    return signedUrl;
  } catch (error) {
    console.error('File URL Retrieval Error:', error);
    throw error;
  }
}

module.exports = {
  generateB2FileUploadUrl,
  getB2FileUrl,
};