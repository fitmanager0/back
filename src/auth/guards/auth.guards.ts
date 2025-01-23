// auth.guards.ts
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



  // async validateUser(email: string, password: string): Promise<any> {
  //   const user = await this.userService.findByEmail(email);

  //   if (user && user.password === password) { // Valida el usuario (agrega un hash si es necesario)
  //     const { password, ...result } = user; // Excluye el password
  //     return result;
  //   }
  //   throw new UnauthorizedException('Credenciales inválidas');
  // }

  // async login(user: any) {
  //   const payload = {
  //     id: user.id_user,
  //     email: user.email,
  //     rol: user.id_rol, // Incluye el rol del usuario
  //   };

  //   return {
  //     access_token: this.jwtService.sign(payload),
  //   };
  // }
}

