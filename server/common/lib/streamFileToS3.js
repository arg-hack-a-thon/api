import AWS from 'aws-sdk';
import AppConfig from '../../config';
import Promise from 'bluebird';

const { S3 } = AWS;

AWS.config.update(AppConfig.get('/aws'))

export default function(bucket, prefix, readStream) {
  return new Promise((resolve, reject) => {
    const s3 = new S3();
    const params = {
      Bucket: bucket,
      Key: generateInputS3Key(prefix, readStream.hapi.filename),
      Body: readStream,
      ContentType: readStream.hapi.headers['content-type']
    }

    s3.upload(params)
      .send((err, data) => {
        if (err) {
          console.log("An error occurred", err);
          return reject(err);
        }

        return resolve({
          key: params.Key,
          url: data.Location
        });

    })
  })
}

function generateInputS3Key(prefix, fileName) {
  const timestamp = Date.now();

  if (prefix.charAt(prefix.length - 1) !== '/') {
    prefix = prefix + '/';
  }

  return prefix + timestamp + '_' + fileName;
}
