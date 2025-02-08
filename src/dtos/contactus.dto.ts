import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ContactUsDto {
  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre del usuario que envía el mensaje' })
  @IsNotEmpty()
  @Length(3, 50)
  name: string;

  @ApiProperty({ example: 'juan.perez@email.com', description: 'Correo electrónico del usuario' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Quisiera más información sobre los planes.', description: 'Mensaje del usuario', minLength: 10, maxLength: 500 })
  @IsNotEmpty()
  @Length(10, 500)
  message: string;
}