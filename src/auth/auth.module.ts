import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service';
import { AuthController } from './auth.controller';
import { User } from '../entities/user.entity';
import { AuthRepository } from './auth.repository';
import { HealthSheet } from 'src/entities/helthsheet.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, HealthSheet]),
    JwtModule.register({
      secret: 'secretKey', // Asegúrate de cambiar 'secretKey' por tu clave secreta
      signOptions: { expiresIn: '5h' }, // Opcional: configurar el tiempo de expiración del token
    }),
  ],
  providers: [AuthService, AuthRepository],
  controllers: [AuthController],
})
export class AuthModule {}
