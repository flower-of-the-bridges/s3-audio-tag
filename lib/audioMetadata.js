const fs = require('fs/promises')
const path = require('path')
const mime = require('mime-types')

/**
 * @typedef {{
 *   file: string,
 *   fullName: string,
 *   status: unknown | null
 * }} AudioMetadata
 */

/**
 *
 * @param {string} fileName
 * @returns {Promise<import('fs').Stats | null>}
 */
async function getFileStats (fileName) {
  try {
    const stats = await fs.stat(fileName)
    return stats
  } catch {}
  return null
}

/**
 *
 * @param {string} fileName
 * @returns {Promise<AudioMetadata[]>}
 */
async function getAudioMetadatasFromDirectory (fileName) {
  const directoryFiles = await fs.readdir(fileName)
  return directoryFiles.map((file) => ({
    file,
    fullName: path.join(fileName, file),
    status: null
  })).filter(({ fullName }) => mime.lookup(fullName)?.includes('audio'))
}

/**
 *
 * @param {string} fileName
 * @throws if content type is not audio or file does not exists
 * @returns {AudioMetadata}
 */
async function getAudioMetadataFromFile (fileName) {
  const contentType = mime.lookup(fileName)
  if (!contentType) {
    throw new Error('file not found')
  } else if (!contentType.includes('audio')) {
    throw new Error('file is not audio. its ' + contentType)
  } else {
    return {
      fullName: fileName,
      file: fileName.split('/').pop(),
      status: null
    }
  }
}

module.exports = {
  getFileStats,
  getAudioMetadatasFromDirectory,
  getAudioMetadataFromFile
}
