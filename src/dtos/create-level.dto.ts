import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateLevelDto {
  @ApiProperty({
    description:
      'Descripción del nivel. Campo de tipo string con un máximo de 20 caracteres.',
    example: 'Nivel principiante',
  })
  @IsNotEmpty({ message: 'La descripción del nivel es obligatoria.' })
  @IsString({ message: 'La descripción debe ser una cadena de texto.' })
  @MaxLength(20, {
    message: 'La descripción no debe superar los 20 caracteres.',
  })
  description: string;
}
