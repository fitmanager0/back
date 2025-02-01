import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsEmail, IsOptional, IsDateString, Length, MaxLength, IsDate, MinDate, MaxDate, IsNotEmpty, ValidateIf, Validate, Matches } from 'class-validator';

export class UpdatePersonalInfoDto {
    @ApiProperty({
        description: 'Nombre y Apellido del usuario',
        example: 'Daniél Alvarado',
    })
    @IsOptional()
    @IsString({ message: 'El campo Nombre y Apellido debe ser de tipo string.' })
    @Length(3, 50, {
    message: 'El Nombre y Apellido debe tener entre 3 y 50 caracteres.',
    })
    name?: string;


    @ApiProperty({
        description: 'Contraseña del usuario',
        example: 'Password#123',
    })
    @IsOptional()
    @IsString({ message: 'El campo Contraseña de ser un string' })
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,15}$/,
        {
          message:
            'La contraseña ingresada debe incluir una mayúscula, una minúscula, un número y un carácter especial (!@#$%^&*) como mínimo y tener una loguitud de 8 y 15 caracteres.',
        },
      )
    password: string;
    

    @ApiProperty({
        description: 'Confirmación del password del usuario que quiere registrarse. Debe ser un String. Como requisitos debe incluir una mayúscula, una minúscula, un número y un carácter especial (!@#$%^&*) como mínimo y tener una loguitud de 8 y 15 caracteres. Es campo obligatorio.',
        example: 'Password#123',
    })
    @ValidateIf((o) => o.password !== undefined || o.confirmPassword !== undefined) // Validar si `password` es enviado
    @IsString({
        message: 'El campo Confirmar Contraseña debe contener caracteres válidos a una cadena de texto.',
    })
    confirmPassword?: string;


    @ApiProperty({
        description: 'Fecha de nacimiento del usuario',
        example: '1999-09-09',
    })
    @IsOptional()
    @Type(() => Date)
    @IsDate({ message: 'La fecha de nacimiento debe ser válida.' })
    @MinDate(new Date('1900-01-01'), {
        message: 'La fecha de nacimiento no puede ser anterior al 1 de enero de 1900.',
    })
    @MaxDate(new Date(), {
        message: 'La fecha de nacimiento no puede ser una fecha futura.',
    })
    birthdate?: string;


    @ApiProperty({
        description: 'Número de teléfono del usuario',
        example: '987654321',
    })
    @IsOptional()
    @IsNotEmpty({ message: 'Ingrese el número telefónico del usuario.' })
    @IsString({ message: 'El número telefónico debe ser un string.' })
    phone?: string;


    @ApiProperty({
        description: 'Dirección del usuario',
        example: 'Avenida Siempre Viva 123',
      })
    @IsOptional()
    @IsString({ message: 'El campo Dirección debe ser un string.' })
    @MaxLength(50, { message: 'La dirección no debe exceder los 50 caracteres.' })
    address?: string;
    

    @ApiProperty({
        description: 'Ciudad del usuario',
        example: 'Ciudad de Buenos Aires',
      })
    @IsOptional()
    @IsString({ message: 'El campo Ciudad debe ser un string.' })
    @MaxLength(50, { message: 'La ciudad no debe exceder los 50 caracteres.' })
    city?: string;
    

    @ApiProperty({
        description: 'País del usuario',
        example: 'Argentina',
      })
    @IsOptional()
    @IsString({ message: 'El campo País debe ser un string.' })
    @MaxLength(50, { message: 'El país no debe exceder los 50 caracteres.' })
    country?: string;
}