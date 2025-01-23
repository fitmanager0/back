// auth.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service';
import { AuthController } from './auth.controller';
import { User } from '../entities/user.entity';
import { AuthRepository } from './auth.repository';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './guards/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }), // Configuración de Passport
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'mySuperSecretKey',
      signOptions: {  expiresIn: '1h' }
    })
],
  providers: [AuthService, AuthRepository, JwtStrategy],     
  controllers: [AuthController],
  exports: [JwtModule, PassportModule],
})
export class AuthModule {}
