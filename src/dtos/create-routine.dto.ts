import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsNotEmpty } from 'class-validator';

export class CreateRoutineDto {
  @ApiProperty({
    description:
      'URL de la rutina. Campo de tipo string con un máximo de 100 caracteres.',
    example: 'https://example.com/routine1',
  })
  @IsNotEmpty({ message: 'La URL de la rutina es obligatoria.' })
  @IsString({ message: 'La URL de la rutina debe ser una cadena de texto.' })
  url_routine: string;

  @ApiProperty({
    description:
      'Identificador del usuario que tiene la rutina. Debe ser un UUID válido.',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty({ message: 'El ID del usuario es obligatorio.' })
  @IsUUID('4', { message: 'El ID del usuario debe ser un UUID válido.' })
  id_user: string;

  @ApiProperty({
    description:
      'Identificador del nivel de la rutina. Debe ser un UUID válido.',
    example: '2',
  })
  @IsNotEmpty({ message: 'El ID del nivel es obligatorio.' })
  @IsUUID('4', { message: 'El ID del nivel debe ser un UUID válido.' })
  id_level: string;
}
