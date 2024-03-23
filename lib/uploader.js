const { getFileStats, getAudioMetadatasFromDirectory, getAudioMetadataFromFile } = require('./audioMetadata')
const { getS3Client, putAudioMetadataToBucket } = require('./s3')
const { getID3Tags, parseID3TagsToAwsTagging } = require('./tags')

/**
 *
 * @param {import('./s3').BucketConnection & import('./s3').BucketParams & {Bucket: string}} bucket
 * @param {{fileName: string}} params
 * @returns
 */
async function uploader ({
  Bucket,
  region,
  accessKeyId,
  secretAccessKey,
  endpoint
}, {
  fileName
}) {
  const stats = await getFileStats(fileName)
  /**
   * @type {import('./audioMetadata').AudioMetadata[]}
   */
  const audioMetadatas = []

  if (stats?.isDirectory()) {
    audioMetadatas.push(...await getAudioMetadatasFromDirectory(fileName))
  } else {
    audioMetadatas.push(getAudioMetadataFromFile(fileName))
  }

  const s3 = getS3Client({
    accessKeyId,
    secretAccessKey
  }, {
    endpoint,
    region
  })

  for await (const audioMetadata of audioMetadatas) {
    try {
      const tags = getID3Tags(audioMetadata.fullName)
      const response = await putAudioMetadataToBucket({
        s3
      }, {
        Bucket,
        audioMetadata,
        Tagging: parseID3TagsToAwsTagging(tags)
      })

      audioMetadata.status = response.$response.httpResponse.statusCode
    } catch (error) {
      audioMetadata.status = error.message
    }
  }
  return audioMetadatas
}

module.exports = {
  uploader
}
