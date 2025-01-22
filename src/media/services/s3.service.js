
const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

// Configure S3 client to use LocalStack
const s3Client = new S3Client({
  region: 'us-east-1',
  endpoint: 'http://localhost:4566',
  credentials: {
    accessKeyId: 'test',
    secretAccessKey: 'test',
  },
  forcePathStyle: true, // Needed for LocalStack
});

/**
 * Generates a pre-signed URL for uploading a file to S3 based on the provided intent and unique ID.
 *
 * @param {string} intent - The type of file to be uploaded (e.g., 'audio', 'video', 'profile').
 * @param {string} uniqueId - A unique identifier for the file.
 * @returns {Promise<{uploadUrl: string, key: string}>} - An object containing the pre-signed upload URL and the S3 key for the file.
 */
async function generateS3FileUploadUrl(intent,uniqueId) {
  let key, contentType, bucketName;
  switch(intent){
    case 'audio':
      key = `audios/${uniqueId}.mp3`;
      contentType = 'audio/mpeg';
      bucketName = 'audio-bucket';
      break;
    case 'video':
      key = `videos/${uniqueId}.mp4`;
      contentType = 'video/mp4';
      bucketName = 'video-bucket';
      break;

    case 'profile':
      key = `profiles/${uniqueId}.jpg`;
      contentType = 'image/jpeg';
      bucketName = 'profile-bucket';
      break;

    default:
      return null; // invalid intent
  }

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: contentType,
  });
  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 180 });
  return { uploadUrl, key };

}

async function getS3FileUrl(intent,uniqueId) {
  let key, bucketName;
  switch(intent){
    case 'audio':
      key = `audios/${uniqueId}.mp3`;
      bucketName = 'audio-bucket';
      break;
    case 'video':
      key = `videos/${uniqueId}.mp4`;
      bucketName = 'video-bucket';
      break;

    case 'profile':
      key = `profiles/${uniqueId}.jpg`;
      bucketName = 'profile-bucket';
      break;

    default:
      return null; // invalid intent
  }


  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });
  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  return signedUrl;

}

module.exports = {
  generateS3FileUploadUrl,
  getS3FileUrl,
};
