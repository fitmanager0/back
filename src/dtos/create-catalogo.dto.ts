import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsUrl, IsNotEmpty } from 'class-validator';

export class CreateCatalogoDto {
    @ApiProperty({
      description:
        'Descripción del nivel. 1 - INICIAL, 2 - INTERMEDIO, 3 - AVANZADO.',
      example: '1',
    })
  @IsInt()
  @IsNotEmpty()
  id_level: number;

  @ApiProperty({ description: 'URL de la rutina', example: 'https://res.cloudinary.com/example/image/upload/rutina.png' })
  @IsUrl()
  @IsNotEmpty()
  url_imagen: string;
}