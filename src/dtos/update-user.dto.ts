import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsEmail, IsIn, IsInt, IsOptional, IsString, Length, Matches, MaxDate, MaxLength, MinDate, Validate, ValidateIf } from "class-validator";
import { MatchPassword } from "../utils/Ms";

export class UpdateUserDto {

    @ApiProperty({
        description: 'Nombre y Apellido del usuario. Campo de tipo string el cual debe tener una longuitud de 3 a 50 caracteres.',
        example: 'Juan Pérez',
    })      
    @IsOptional()
    @IsString({ message: 'El campo Nombre y Apellido debe ser de tipo string.' })
    @Length(3, 50, { message: 'El Nombre y Apellido ingresado debe tener una longuitud de 3 a 50 carateres.' })
    name: string;
    
    @ApiProperty({
        description: 'Correo electrónico del usuario. Campo de tipo string que no debe superar los 50 caracteres.',
        example: 'juan.perez@example.com',
    })
    @IsOptional()
    @IsEmail({}, { message: 'El campo de Email debe tener un formato de correo electronico válido: ejemplo@email.com' })
    @MaxLength(50, { message: 'El Email ingresado no debe exceder los 50 caracteres.' } )
    email: string;
    
    @ApiProperty({
        description: 'Contraseña del usuario',
        example: 'ContraseñaSegura123',
    })
    @IsOptional()
    @IsString({ message: 'El campo Contraseña de ser un string' })
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,15}$/,
        { message: 'La contraseña ingresada debe incluir una mayúscula, una minúscula, un número y un carácter especial (!@#$%^&*) como mínimo y tener una loguitud de 8 y 15 caracteres.' }
    )
    password: string;

    @ApiProperty({
        description: 'Confirmación del password del usuario que quiere registrarse. Debe ser un String. Como requisitos debe incluir una mayúscula, una minúscula, un número y un carácter especial (!@#$%^&*) como mínimo y tener una loguitud de 8 y 15 caracteres. Es campo obligatorio.',
        example: 'ContraseñaSegura123',
    })
    @ValidateIf((o) => o.password !== undefined) // Validar si `password` es enviado
    @IsString({ message: 'El campo Confirmar Contraseña debe contener caracteres válidos a una cadena de texto.' })
    @Validate(MatchPassword, ['password'], {
    message: 'Las contraseñas ingresadas deben coincidir.',
  })
    confirmPassword: string;

    @ApiProperty({
        description: 'Identificador del rol del usuario. Debe ser un número entero. Valores permitidos: 1, 2 o 3',
        example: 1,
    })
    @IsOptional()
    @IsInt({ message: 'El Id del Rol debe ser un número entero.' })
    @IsIn([1, 2, 3], { message: 'El Id del Rol debe ser uno de los siguientes valores: 1, 2 o 3.' })
    id_rol: number;
    
    @ApiProperty({
        description: 'Fecha de nacimiento del usuario. Este campo debe ser de tipo Fecha',
        example: '1990-01-01',
    })
    @IsOptional()
    @Type(() => Date)
    @IsDate({ message: 'La fecha de nacimiento debe ser una fecha válida. Ejemplo: 1990-01-01' })
    @MinDate(new Date('1900-01-01'), { message: 'La fecha de nacimiento no puede ser anterior al 1 de enero de 1900.' })
    @MaxDate(new Date(), { message: 'La fecha de nacimiento no puede ser una fecha futura.' })
    birthdate: Date;

    @ApiProperty({
        description: 'Número de teléfono del usuario. Campo de tipo número entero.',
        example: 1234567890,
    })
    @IsOptional()
    @IsInt({ message: 'El número telefónico debe ser un número entero.' })
    phone: number;
    
    @ApiProperty({
        description: 'Dirección del usuario. Campo de tipo string el cual no debe superar los 50 caracteres.',
        example: 'Avenida Siempre Viva 123',
    })
    @IsOptional() 
    @IsString({ message: 'El campo domicilio debe ser de tipo string.' })
    @MaxLength(50, { message: 'El domicilio no debe superar los 50 caracteres.' })
    address: string;
    
    @ApiProperty({
        description: 'Ciudad del usuario. Campo de tipo string el cual no debe superar los 50 caracteres.',
        example: 'Ciudad de Buenos Aires',
    })
    @IsOptional()
    @IsString({ message: 'El campo de Ciudad debe ser de tipo string.' })
    @MaxLength(50, { message: 'La ciudad no debe superar los 50 caracteres.' })
    city: string;
    
    @ApiProperty({
        description: 'País del usuario. Campo de tipo string el cual no debe superar los 50 caracteres.',
        example: 'Argentina',
    })
    @IsOptional()
    @IsString({ message: 'El campo de País debe se de tipo string.' })
    @MaxLength(50, { message: 'El país no debe superar los 50 caracteres.' })
    country: string;
    
    @ApiProperty({
        description: 'Indica si el usuario está activo. Este campo es de tipo booleano(true o false)',
        example: true,
    })
    @IsOptional()
    @IsBoolean({ message: 'El campo de Estado debe ser un valor booleano (true o false).' })
    isActive: boolean;
    
    
    @ApiProperty({
        description: 'Fecha de registro del usuario. Campo de tipo Date.',
        example: '2023-01-01',
    })
    @IsOptional()
    @Type(() => Date)
    @MaxDate(new Date(), { message: 'La fecha de registro no puede ser una fecha futura.' })
    entry_date: Date;
}