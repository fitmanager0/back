import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),//process.env.JWT_SECRET || 'mySuperSecretKey',
    });
  }

  async validate(payload: any) {
    console.log(payload.id, payload.email, payload.rol)

    return { id_user: payload.id, email: payload.email, id_rol: payload.rol }; // Estructura del usuario
  }
}