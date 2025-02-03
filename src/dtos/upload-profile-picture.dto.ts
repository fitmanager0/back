import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UploadProfilePictureDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Archivo de imagen a cargar',
  })
  @IsNotEmpty()
  file: any; // Usamos 'any' porque Multer no tiene un tipo estricto en este caso
}
