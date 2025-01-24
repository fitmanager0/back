import {
  Controller,
  Get,
  Post,
  Body,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../dtos/LoginUserDto';
import { CreateUserDto } from '../dtos/CreateUserDto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth') 
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado correctamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o incompletos.',
  })
  @ApiBody({
    description: 'Datos necesarios para registrar un usuario',
    type: CreateUserDto,
  })
  async signUp(@Body() user: CreateUserDto) {
    return this.authService.signup(user);
  }

  @Post('/signin')
  @ApiOperation({ summary: 'Iniciar sesión con correo electrónico y contraseña' })
  @ApiResponse({
    status: 200,
    description: 'Inicio de sesión exitoso, devuelve un token de acceso.',
  })
  @ApiResponse({
    status: 400,
    description: 'Credenciales inválidas o error desconocido.',
  })
  @ApiBody({
    description: 'Datos necesarios para iniciar sesión',
    type: LoginUserDto,
  })
  async signin(@Body() loginUserDto: LoginUserDto) {
    try {
      const { email, password } = loginUserDto;
      return await this.authService.signin(email, password);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException(
          'Credenciales inválidas. Verifique el correo electrónico y la contraseña.',
        );
      }

      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new BadRequestException(`Error al iniciar sesión. ${errorMessage}`);
    }
  }
}
