import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsOptional, IsString, Length, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CompleteUserDto {
  @ApiProperty({ description: 'Fecha de nacimiento del usuario', example: '1990-01-01' })
  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'La fecha de nacimiento debe ser válida.' })
  birthdate?: Date;

  @ApiProperty({ description: 'Número de teléfono del usuario', example: '1234567890' })
  @IsOptional()
  @IsString({ message: 'El número telefónico debe ser un string.' })
  phone?: string;

  @ApiProperty({ description: 'Dirección del usuario', example: 'Avenida Siempre Viva 123' })
  @IsOptional()
  @IsString({ message: 'La dirección debe ser un string.' })
  @MaxLength(50, { message: 'La dirección no debe exceder los 50 caracteres.' })
  address?: string;

  @ApiProperty({ description: 'Ciudad del usuario', example: 'Ciudad de Buenos Aires' })
  @IsOptional()
  @IsString({ message: 'La ciudad debe ser un string.' })
  @MaxLength(50, { message: 'La ciudad no debe exceder los 50 caracteres.' })
  city?: string;

  @ApiProperty({ description: 'País del usuario', example: 'Argentina' })
  @IsOptional()
  @IsString({ message: 'El país debe ser un string.' })
  @MaxLength(50, { message: 'El país no debe exceder los 50 caracteres.' })
  country?: string;
}
