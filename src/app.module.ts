import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PaymentModule } from './payment/payment.module';
import { User } from './entities/user.entity';
import { Routine } from './entities/routine.entity';
import { Role } from './entities/roles.entity';
import { Payment } from './entities/payments.entity';
import { Level } from './entities/level.entity';
import { HealthSheet } from './entities/helthsheet.entity';
import { RoutinesModule } from './routines/routines.module';
import { LevelsModule } from './levels/levels.module';
<<<<<<< HEAD
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
=======
>>>>>>> 5e7624170e97e5b24987e2c6b0ed273b0c468c4f
import { AuthModule } from './auth/auth.module';

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
        synchronize: true, // Solo para desarrollo, no usar en producción
      }),
    }),
    RoutinesModule,
    LevelsModule,
    UserModule,
    AuthModule,
    PaymentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
