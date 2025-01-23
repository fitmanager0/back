import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
  MaxDate,
  MaxLength,
  MinDate,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Nombre y Apellido del usuario',
    example: 'Juan Pérez',
  })
  @IsNotEmpty({ message: 'Ingrese el Nombre y Apellido del usuario.' })
  @IsString({ message: 'El campo Nombre y Apellido debe ser de tipo string.' })
  @Length(3, 50, {
    message:
      'El Nombre y Apellido ingresado debe tener una longitud de 3 a 50 caracteres.',
  })
  name: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'juan.perez@example.com',
  })
  @IsNotEmpty({ message: 'Ingrese el Email del usuario.' })
  @IsEmail({}, { message: 'El campo de Email debe ser válido.' })
  @MaxLength(50, {
    message: 'El Email ingresado no debe exceder los 50 caracteres.',
  })
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'ContraseñaSegura123',
  })
  @IsNotEmpty({ message: 'Ingrese la contraseña del usuario.' })
  @IsString({ message: 'El campo Contraseña debe ser un string.' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,15}$/,
    {
      message:
        'La contraseña debe incluir una mayúscula, una minúscula, un número y un carácter especial (!@#$%^&*) y tener entre 8 y 15 caracteres.',
    },
  )
  password: string;

  @ApiProperty({
    description: 'Confirmación de la contraseña',
    example: 'ContraseñaSegura123',
  })
  @IsNotEmpty({ message: 'Confirme la contraseña del usuario.' })
  @IsString({ message: 'El campo Confirmar Contraseña debe ser un string.' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,15}$/,
    {
      message:
        'La confirmación de la contraseña debe cumplir los mismos requisitos que la contraseña.',
    },
  )
  @Exclude({ toPlainOnly: true }) // Excluir al serializar a objetos planos
  confirmPassword: string;

  @ApiProperty({
    description: 'Identificador del rol del usuario',
    example: 1,
  })
  @IsNotEmpty({ message: 'Debe ingresar el Id del Rol del usuario.' })
  @IsInt({ message: 'El Id del Rol debe ser un número entero.' })
  @IsIn([1, 2, 3], {
    message: 'El Id del Rol debe ser uno de los siguientes valores: 1, 2 o 3.',
  })
  id_rol: number;

  @ApiProperty({
    description: 'Fecha de nacimiento del usuario',
    example: '1990-01-01',
  })
  @IsNotEmpty({ message: 'Ingrese la fecha de nacimiento del usuario.' })
  @IsDate({ message: 'La fecha de nacimiento debe ser válida.' })
  @MinDate(new Date('1900-01-01'), {
    message:
      'La fecha de nacimiento no puede ser anterior al 1 de enero de 1900.',
  })
  @MaxDate(new Date(), {
    message: 'La fecha de nacimiento no puede ser una fecha futura.',
  })
  birthdate: Date;

  @ApiProperty({
    description: 'Número de teléfono del usuario',
    example: 1234567890,
  })
  @IsNotEmpty({ message: 'Debe ingresar el número telefónico del usuario.' })
  @IsInt({ message: 'El número telefónico debe ser un número entero.' })
  phone: string;

  @ApiProperty({
    description: 'Dirección del usuario',
    example: 'Avenida Siempre Viva 123',
  })
  @IsNotEmpty({ message: 'Ingrese la dirección del usuario.' })
  @IsString({ message: 'El campo Dirección debe ser un string.' })
  @MaxLength(50, { message: 'La dirección no debe superar los 50 caracteres.' })
  address: string;

  @ApiProperty({
    description: 'Ciudad del usuario',
    example: 'Ciudad de Buenos Aires',
  })
  @IsNotEmpty({ message: 'Ingrese la ciudad de residencia del usuario.' })
  @IsString({ message: 'El campo Ciudad debe ser un string.' })
  @MaxLength(50, { message: 'La ciudad no debe superar los 50 caracteres.' })
  city: string;

  @ApiProperty({
    description: 'País del usuario',
    example: 'Argentina',
  })
  @IsNotEmpty({ message: 'Ingrese el país del usuario.' })
  @IsString({ message: 'El campo País debe ser un string.' })
  @MaxLength(50, { message: 'El país no debe superar los 50 caracteres.' })
  country: string;

  @ApiProperty({
    description: 'Indica si el usuario está activo',
    example: true,
  })
  @IsNotEmpty({ message: 'Indique el estado del usuario.' })
  @IsBoolean({ message: 'El campo Estado debe ser un valor booleano.' })
  isActive: boolean;
  @ApiProperty({
    description: 'ID del HealthSheet asociado al usuario (opcional)',
    example: '7f1ebf7c-c1f7-4ca4-89d5-19b2d8e70712',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  healthSheetId?: string;
}
