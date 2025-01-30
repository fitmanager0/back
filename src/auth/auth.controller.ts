import {
  Controller,
  Get,
  Post,
  Body,
  BadRequestException,
  NotFoundException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../dtos/LoginUserDto';
import { CreateUserDto } from '../dtos/CreateUserDto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from './guards/public.decorator';
import { AuthGuard } from '@nestjs/passport';
import { CompleteUserDto } from 'src/dtos/complete-user.dto';

@ApiTags('Auth: Registro e Inicio de Sesión') 
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/signup')
  @ApiOperation({ 
    summary: 'Registrar un nuevo usuario (Public)',
    description: 'Registro de nuevos usuarios, acceso puclico.'
  })
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

  @Public()
  @Post('/signin')
  @ApiOperation({ 
    summary: 'Iniciar sesión de usuarios (Public)',
    description: 'Inicio de seción de usuarios mediante autenticación ingresando correo electrónico y contraseña'
  })
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

  
  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({
    summary: 'Iniciar autenticación con Google (Public)',
    description:
      'Este endpoint redirige al usuario a la página de autenticación de Google para autorizar la aplicación.',
  })
  @ApiResponse({
    status: 302,
    description: 'Redirección a la página de autenticación de Google.',
  })
  async googleAuth(@Req() req) {}

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({
    summary: 'Callback de Google OAuth (Public)',
    description:
      'Este endpoint es llamado por Google después de que el usuario autoriza la aplicación. ' +
      'Maneja la lógica de inicio de sesión y devuelve un token JWT.',
  })
  @ApiResponse({
    status: 200,
    description: 'Inicio de sesión exitoso. Devuelve un token JWT y los datos del usuario.',
    schema: {
      example: {
        mensaje: 'Logged in with Google',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          email: 'user@example.com',
          firstName: 'John',
          lastName: 'Doe',
          picture: 'https://example.com/profile.jpg',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Error: No se pudo obtener el usuario de Google.',
  })
  async googleAuthRedirect(@Req() req) {
    const result = await this.authService.googleLogin(req);
  
    const redirectUrl = `http://localhost:3001/auth/callback?token=${result.token}&user=${encodeURIComponent(JSON.stringify(result.user))}`;
    req.res.redirect(redirectUrl);
  }

  @Public()
  @Post('complete-registration')
  @ApiOperation({
    summary: 'Completar el registro de usuario autenticado con Google',
    description: 'Este endpoint permite completar los datos faltantes de un usuario autenticado con Google.',
  })
  @ApiResponse({
    status: 200,
    description: 'Registro completado con éxito.',
  })
  @ApiResponse({
    status: 400,
    description: 'Error en la solicitud.',
  })
  @ApiBody({ type: CompleteUserDto })
  async completeRegistration(@Req() req, @Body() completeUserDto: CompleteUserDto) {
    return this.authService.completeRegistration(req.user.email, completeUserDto);
  }
}
