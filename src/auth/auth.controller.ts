// auth.controller
import { Controller, Get, Post, Body, BadRequestException,NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../dtos/LoginUserDto';
import { CreateUserDto } from '../dtos/create-user.dto';
import { ApiTags } from '@nestjs/swagger';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
    async signUp(@Body() user: CreateUserDto) {
    const { confirmPassword,...newUser} = user;
    return this.authService.signup(newUser);
  }


  @Post('/signin')
    async signin(@Body() loginUserDto: LoginUserDto) {
      try {
        const { email, password } = loginUserDto;
        return await this.authService.signin(email, password);
      } catch (error) {
        if (error instanceof NotFoundException) {
        throw new BadRequestException('Credenciales inválidas. Verifique el correo electrónico y la contraseña.');
      }

      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      throw new BadRequestException(`Error al iniciar sesión. ${errorMessage}`);
    }
  }
}
