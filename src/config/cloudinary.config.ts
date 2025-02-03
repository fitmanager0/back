import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CloudinaryConfig {
  private readonly MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB

  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    // Validación de tamaño
    if (file.size > this.MAX_FILE_SIZE) {
      throw new BadRequestException('El archivo excede el tamaño máximo permitido de 1 MB.');
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'profile_pictures',
          resource_type: 'image',
          allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        },
        (error, result: UploadApiResponse | undefined) => {
          if (error) {
            return reject(error);
          }
          if (!result) {
            return reject(new Error('Upload failed, no response received from Cloudinary'));
          }
          resolve(result.secure_url);
        },
      );

      uploadStream.end(file.buffer);
    });
  }
}

