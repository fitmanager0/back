import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  Body,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../dtos/LoginUserDto';
import { CreateUserDto } from '../dtos/CreateUserDto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from './guards/public.decorator';
import { Request, Response } from 'express';

@ApiTags('Auth: Registro e Inicio de Sesión')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/signup')
  @ApiOperation({
    summary: 'Registrar un nuevo usuario (Public)',
    description: 'Registro de nuevos usuarios, acceso público.'
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
    description: 'Inicio de sesión mediante correo electrónico y contraseña'
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
  @Get('/login')
  @ApiOperation({
    summary: 'Redirigir a Auth0 para inicio de sesión',
  })
  async login(@Res() res: Response) {
    const authUrl = this.authService.getAuth0LoginUrl();
    return res.redirect(authUrl);
  }

  @Public()
  @Get('/callback')
  @ApiOperation({
    summary: 'Procesar callback de Auth0',
  })
  async callback(@Req() req: Request, @Res() res: Response) {
    const user = await this.authService.handleAuth0Callback(req.query);
    if (!user.isProfileComplete) {
      return res.redirect('/complete-profile');
    }
    return res.redirect('/dashboard');
  }
}