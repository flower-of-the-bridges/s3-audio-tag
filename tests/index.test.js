const tap = require('tap')
const { uploader } = require('../lib/uploader')
const path = require('path')
const { S3 } = require('aws-sdk')

const endpoint = 'http://localhost:4566'
const region = 'us-east-1'
const accessKeyId = 'client_id'
const secretAccessKey = 'client_secret'
const Bucket = 'your-bucket-name'

tap.test('s3-audio-tag', async test => {
  test.test('file is uploaded correctly and tags are saved', async assert => {
    await uploader({
      accessKeyId,
      endpoint,
      region,
      secretAccessKey,
      Bucket
    }, {
      fileName: path.join(__dirname, 'examples', 'file_example.mp3')
    })
    const s3 = new S3({
      endpoint,
      s3ForcePathStyle: true, // Required for LocalStack
      region, // replace with your S3 bucket region
      accessKeyId, // replace with your AWS access key ID
      secretAccessKey // replace with your AWS secret access key
    })
    const response = await s3.getObjectTagging({
      Bucket,
      Key: 'file_example.mp3'
    }).promise()
    tap.strictSame(response.TagSet, [
      {
        Key: 'title',
        Value: 'Tomorrow'
      },
      {
        Key: 'artist',
        Value: 'Kevin Penkin'
      },
      {
        Key: 'album',
        Value: 'test'
      },
      {
        Key: 'trackNumber',
        Value: '27'
      }
    ], 'tags match file')
  })

  test.test('folder is uploaded correctly', async assert => {
    await uploader({
      accessKeyId,
      endpoint,
      region,
      secretAccessKey,
      Bucket
    }, {
      fileName: path.join(__dirname, 'examples')
    })
    assert.pass()
  })

  test.test('file is not audio', async assert => {
    const error = await assert.rejects(() => uploader({

    }, {
      fileName: path.join(__dirname, 'examples', 'not-audio.txt')
    }))

    assert.strictSame(error.message, 'file is not audio. its text/plain')
  })

  test.test('file does not exists', async assert => {
    const error = await assert.rejects(() => uploader({

    }, {
      fileName: 'wrong file'
    }))

    assert.strictSame(error.message, 'file not found')
  })
})
