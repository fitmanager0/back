import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PaymentModule } from './payment/payment.module';
import { RoutinesModule } from './routines/routines.module';
import { LevelsModule } from './levels/levels.module';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { User } from './entities/user.entity';
import { Role } from './entities/roles.entity';
import { Level } from './entities/level.entity';
import { HealthSheet } from './entities/helthsheet.entity'; // Importar HealthSheet
import { UserSeederService } from './seeders/user-seeder.service';
import { UserSeederModule } from './seeders/seeders.module';
import { Tree } from 'typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [
        ConfigModule,
        JwtModule.register({
          global: true,
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '5h' },
        }),
      ],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        autoLoadEntities: true,
        dropSchema: true,
        synchronize: true, // Solo para desarrollo, no usar en producción
      }),
    }),
    RoutinesModule,
    LevelsModule,
    UserModule,
    AuthModule,
    PaymentModule,
    UserSeederModule,
    TypeOrmModule.forFeature([User, Role, Level, HealthSheet]), // Añadir HealthSheet aquí
  ],
  controllers: [],
  providers: [UserSeederService],
})
export class AppModule {}
