import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/user.service'; // Asegúrate de importar tu servicio de usuario
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard {
  constructor(
    private jwtService: JwtService,
    private userService: UserService, // Servicio para buscar usuarios
    private reflector: Reflector //##
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    console.log('Authorization Header:', authHeader);  // Añadir esta línea para debugging

    if (!authHeader) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.split(' ')[1]; // 'Bearer {token}'
    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET || 'mySuperSecretKey',
      });

      // Agregamos los datos del usuario a la solicitud para que estén disponibles en otros lugares
      request.user = payload;

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}