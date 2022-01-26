import { Injectable, BadRequestException } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import * as path from 'path';

@Injectable()
export class ImageService {
  private readonly awsS3: AWS.S3;
  public readonly S3_BUCKET_NAME: string;

  constructor() {
    this.awsS3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
    this.S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
  }

  async uploadImageToS3(folder: string, image: Express.Multer.File) {
    try {
      const key = `images/${folder}/${Date.now()}_${path.basename(
        image.originalname,
      )}`.replace(/ /g, '');

      await this.awsS3
        .putObject({
          Bucket: this.S3_BUCKET_NAME,
          Key: key,
          Body: image.buffer,
          ContentType: image.mimetype,
        })
        .promise();

      return `https://${this.S3_BUCKET_NAME}.s3.amazonaws.com/${key}`;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('IMAGE_UPLOAD_FAILED');
    }
  }
}
