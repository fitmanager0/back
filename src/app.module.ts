import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RoutinesModule } from './routines/routines.module';
import { LevelsModule } from './levels/levels.module';
<<<<<<< HEAD
import { UserModule } from './user/user.module';
=======
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
>>>>>>> origin/develop

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,  // Hace accesibles las variables de entorno en toda la app
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule,
        JwtModule.register({
          global: true,
          secret: process.env.JWT_SECRET,
          signOptions: {expiresIn: '5h'},
        })
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
<<<<<<< HEAD
    UserModule,
=======
    AuthModule,
>>>>>>> origin/develop
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
