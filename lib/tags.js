const NodeID3 = require('node-id3')

/**
 * @param {string} filePath
 * @returns {NodeID3.Tags}
 */
function getID3Tags (filePath) {
  return NodeID3.read(filePath)
}

/**
 * @param {NodeID3.Tags}
 */
function parseID3TagsToAwsTagging (id3Tags) {
  return encodeURI(Object.entries(id3Tags)
    .filter(([key]) => key !== 'raw')
    .map(([key, value]) => `${key}=${value}`).join('&'))
}

module.exports = {
  getID3Tags,
  parseID3TagsToAwsTagging
}
