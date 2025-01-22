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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [HealthSheet, Level, Payment, Role, Routine, User],
        synchronize: true, // Solo para desarrollo, no usar en producción
      }),
    }),
    PaymentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
