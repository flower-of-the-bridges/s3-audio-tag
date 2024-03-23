const { S3 } = require('aws-sdk')
const { readFile } = require('fs/promises')

/**
 * @typedef {{accessKeyId: string, secretAccessKey: string}} BucketConnection
 * @typedef {{endpoint: string, region: string}} BucketParams
 */

/**
 *
 * @param {BucketConnection} context
 * @param {BucketParams} params
 * @returns {import('aws-sdk').S3}
 */
function getS3Client ({
  accessKeyId,
  secretAccessKey
}, {
  endpoint,
  region
}) {
  return new S3({
    endpoint,
    s3ForcePathStyle: true, // Required for LocalStack
    region, // replace with your S3 bucket region
    accessKeyId, // replace with your AWS access key ID
    secretAccessKey // replace with your AWS secret access key
  })
}

/**
 * @param {{
 *   s3: import('aws-sdk').S3
 * }} params
 * @param {{
 *   Bucket: string,
 *   audioMetadata: import('./audioMetadata').AudioMetadata,
 *   Tagging: string
 * }} params
 * @returns
 */
async function putAudioMetadataToBucket ({
  s3
}, {
  Bucket,
  audioMetadata,
  Tagging
}) {
  const { file, fullName } = audioMetadata
  return s3.putObject({
    Bucket,
    Key: file,
    Body: await readFile(fullName),
    Tagging
  }).promise()
}

module.exports = {
  getS3Client,
  putAudioMetadataToBucket
}
