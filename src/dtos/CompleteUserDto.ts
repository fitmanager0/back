import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsOptional,
  IsString,
  Length,
  MaxDate,
  MaxLength,
  MinDate,
} from 'class-validator';

export class CompleteUserDto {
  @ApiProperty({
    description: 'Fecha de nacimiento del usuario en formato YYYY-MM-DD.',
    example: '1990-01-01',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'La fecha de nacimiento debe ser válida.' })
  @MinDate(new Date('1900-01-01'), {
    message: 'La fecha de nacimiento no puede ser anterior al 1 de enero de 1900.',
  })
  @MaxDate(new Date(), { message: 'La fecha de nacimiento no puede ser una fecha futura.' })
  birthdate?: Date;

  @ApiProperty({
    description: 'Número de teléfono del usuario.',
    example: '+1234567890',
  })
  @IsOptional()
  @IsString({ message: 'El número telefónico debe ser un string.' })
  @Length(8, 15, { message: 'El número telefónico debe tener entre 8 y 15 caracteres.' })
  phone?: string;

  @ApiProperty({
    description: 'Dirección del usuario.',
    example: 'Avenida Siempre Viva 123',
  })
  @IsOptional()
  @IsString({ message: 'El campo Dirección debe ser un string.' })
  @MaxLength(50, { message: 'La dirección no debe exceder los 50 caracteres.' })
  address?: string;

  @ApiProperty({
    description: 'Ciudad del usuario.',
    example: 'Ciudad de Buenos Aires',
  })
  @IsOptional()
  @IsString({ message: 'El campo Ciudad debe ser un string.' })
  @MaxLength(50, { message: 'La ciudad no debe exceder los 50 caracteres.' })
  city?: string;

  @ApiProperty({
    description: 'País del usuario.',
    example: 'Argentina',
  })
  @IsOptional()
  @IsString({ message: 'El campo País debe ser un string.' })
  @MaxLength(50, { message: 'El país no debe exceder los 50 caracteres.' })
  country?: string;

  @ApiProperty({
    description: 'Indica si el usuario ha completado su perfil.',
    example: true,
  })
  @IsBoolean({ message: 'El campo isProfileComplete debe ser un valor booleano.' })
  isProfileComplete: boolean = true;
}
