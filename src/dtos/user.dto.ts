import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, isBoolean, IsDate, IsEmail, IsIn, IsInt, IsNotEmpty, IsString, Length, Matches, MaxDate, MaxLength, MinDate } from "class-validator";

export class CreateUserDto {

    @ApiProperty({
        description: 'Nombre y Apellido del usuario. Campo de tipo string el cual debe tener una longuitud de 3 a 50 caracteres.',
        example: 'Juan Pérez',
    })      
    @IsNotEmpty({ message: 'Ingrese el Nombre y Apellido del usuario.' })
    @IsString({ message: 'El campo Nombre y Apellido debe ser de tipo string.' })
    @Length(3, 50, { message: 'El Nombre y Apellido ingresado debe tener una longuitud de 3 a 50 carateres.' })
    name: string;
    
    @ApiProperty({
        description: 'Correo electrónico del usuario. Campo de tipo string que no debe superar los 50 caracteres.',
        example: 'juan.perez@example.com',
    })
    @IsNotEmpty({ message: 'Ingrese el Email del usuario.' })
    @IsEmail({}, { message: 'El campo de Email debe tener un formato de correo electronico válido: ejemplo@email.com' })
    @MaxLength(50, { message: 'El Email ingresado no debe exceder los 50 caracteres.' } )
    email: string;
    
    @ApiProperty({
        description: 'Contraseña del usuario',
        example: 'ContraseñaSegura123',
    })
    @IsNotEmpty({ message: 'Contraseña del usuario que quiere registrarse. Debe ser un String. Como requisitos debe incluir una mayúscula, una minúscula, un número y un carácter especial (!@#$%^&*) como mínimo y tener una loguitud de 8 y 15 caracteres. Es campo obligatorio.' })
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
    @IsNotEmpty({ message: 'Ingrese la contraseña del usuario.' })
    @IsString({ message: 'El campo Confirmar Contraseña debe ser un string' })
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,15}$/,
        { message: 'La confirmación de la contraseña ingresada debe incluir una mayúscula, una minúscula, un número y un carácter especial (!@#$%^&*) como mínimo y tener una loguitud de 8 y 15 caracteres.' }
    )
    confirmPassword: string;

    @ApiProperty({
        description: 'Identificador del rol del usuario. Debe ser un número entero. Valores permitidos: 1, 2 o 3',
        example: 1,
    })
    @IsNotEmpty({ message: 'Debe ingresar el Id del Rol del usuario.' })
    @IsInt({ message: 'El Id del Rol debe ser un número entero.' })
    @IsIn([1, 2, 3], { message: 'El Id del Rol debe ser uno de los siguientes valores: 1, 2 o 3.' })
    id_rol: number;
    
    @ApiProperty({
        description: 'Fecha de nacimiento del usuario. Este campo debe ser de tipo Fecha',
        example: '1990-01-01',
      })
    @IsNotEmpty({ message: 'Ingresar la fecha de nacimiento del usuario.' })
    @Type(() => Date)
    @IsDate({ message: 'La fecha de nacimiento debe ser una fecha válida. Ejemplo: 1990-01-01' })
    @MinDate(new Date('1900-01-01'), { message: 'La fecha de nacimiento no puede ser anterior al 1 de enero de 1900.' })
    @MaxDate(new Date(), { message: 'La fecha de nacimiento no puede ser una fecha futura.' })
    birthdate: Date;

    @ApiProperty({
        description: 'Número de teléfono del usuario. Campo de tipo número entero.',
        example: 1234567890,
    })
    @IsNotEmpty({ message: 'Debe ingresar el número telofónico del usuario.' })
    @IsInt({ message: 'El número telefónico debe ser un número entero.' })
    phone: number;
    
    @ApiProperty({
        description: 'Dirección del usuario. Campo de tipo string el cual no debe superar los 50 caracteres.',
        example: 'Avenida Siempre Viva 123',
    })
    @IsNotEmpty({ message: 'Ingrese el domicilio del usuario.' }) 
    @IsString({ message: 'El campo domicilio debe ser de tipo string.' })
    @MaxLength(50, { message: 'El domicilio no debe superar los 50 caracteres.' })
    address: string;
    
    @ApiProperty({
        description: 'Ciudad del usuario. Campo de tipo string el cual no debe superar los 50 caracteres.',
        example: 'Ciudad de Buenos Aires',
    })
    @IsNotEmpty({ message: 'Ingrese la ciudad de recidencia del usuario.' })
    @IsString({ message: 'El campo de Ciudad debe ser de tipo string.' })
    @MaxLength(50, { message: 'La ciudad no debe superar los 50 caracteres.' })
    city: string;
    
    @ApiProperty({
        description: 'País del usuario. Campo de tipo string el cual no debe superar los 50 caracteres.',
        example: 'Argentina',
    })
    @IsNotEmpty({ message: 'Ingrese el país de del usuario' })
    @IsString({ message: 'El campo de País debe se de tipo string.' })
    @MaxLength(50, { message: 'El país no debe superar los 50 caracteres.' })
    country: string;
    
    @ApiProperty({
        description: 'Indica si el usuario está activo. Este campo es de tipo booleano(true o false)',
        example: true,
    })
    @IsNotEmpty({ message: 'Ingrese el campo de Estado del usuario.' })
    @IsBoolean({ message: 'El campo de Estado debe ser un valor booleano (true o false).' })
    isActive: boolean;
    
    
    @ApiProperty({
        description: 'Fecha de registro del usuario. Campo de tipo Date.',
        example: '2023-01-01',
    })
    @IsNotEmpty({ message: 'Ingresar la fecha de registro del usuario.' })
    @Type(() => Date)
    @MaxDate(new Date(), { message: 'La fecha de registro no puede ser una fecha futura.' })
    entry_date: Date;
}