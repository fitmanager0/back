import { IsNotEmpty, IsString, IsInt, Min, Max } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty({ message: 'El contenido es obligatorio.' })
  @IsString({ message: 'El contenido debe ser una cadena de texto.' })
  content: string;

  @IsNotEmpty({ message: 'La calificación es obligatoria.' })
  @IsInt({ message: 'La calificación debe ser un número entero.' })
  @Min(1, { message: 'La calificación debe ser al menos 1.' })
  @Max(5, { message: 'La calificación no puede ser mayor a 5.' })
  rating: number; 
}
