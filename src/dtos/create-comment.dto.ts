import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty({ message: 'El contenido es obligatorio.' })
  @IsString({ message: 'El contenido debe ser una cadena de texto.' })
  content: string;

  @IsNotEmpty({ message: 'El ID del recurso es obligatorio.' })
  @IsInt({ message: 'El ID del recurso debe ser un número entero.' })
  resourceId: number;
}
