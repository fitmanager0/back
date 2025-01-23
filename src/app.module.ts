// app.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PaymentModule } from './payment/payment.module';
import { RoutinesModule } from './routines/routines.module';
import { LevelsModule } from './levels/levels.module';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Hace que las configuraciones estén disponibles globalmente
    }),
    // Configuración de la base de datos
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
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        autoLoadEntities: true,
        synchronize: true, // Solo para desarrollo, no usar en producción
        dropSchema: true,  // Si es necesario para desarrollo, ajusta según el caso
      }),
    }),

    // Configuración del JWT de forma independiente
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default_secret_key', // Usa tu secret desde el .env
      signOptions: { expiresIn: '1h' }, // Tiempo de expiración del token
    }),

    // Módulos de la aplicación
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

// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { PaymentModule } from './payment/payment.module';
// import { RoutinesModule } from './routines/routines.module';
// import { LevelsModule } from './levels/levels.module';
// import { UserModule } from './user/user.module';
// import { JwtModule } from '@nestjs/jwt';
// import { AuthModule } from './auth/auth.module';

// @Module({
//   imports: [
//     ConfigModule.forRoot({
//       isGlobal: true,
//     }),
//     TypeOrmModule.forRootAsync({
//       imports: [
//         ConfigModule,
//         JwtModule.register({
//           global: true,
//           secret: process.env.JWT_SECRET,
//           signOptions: { expiresIn: '1h' },
//         }),
//       ],
//       inject: [ConfigService],
//       useFactory: (configService: ConfigService) => ({
//         type: 'postgres',
//         host: configService.get<string>('DB_HOST'),
//         port: configService.get<number>('DB_PORT'),
//         username: configService.get<string>('DB_USERNAME'),
//         password: configService.get<string>('DB_PASSWORD'),
//         database: configService.get<string>('DB_NAME'),
//         entities: [__dirname + '/**/*.entity{.ts,.js}'],
//         autoLoadEntities: true,
//         synchronize: true, // Solo para desarrollo, no usar en producción
//         dropSchema: true
//       }),
//     }),
//     RoutinesModule,
//     LevelsModule,
//     UserModule,
//     AuthModule,
//     PaymentModule,
//   ],
//   controllers: [],
//   providers: [],
// })
// export class AppModule {}
