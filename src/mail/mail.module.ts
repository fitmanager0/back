// import { MailerModule } from '@nestjs-modules/mailer';
// import { Module } from '@nestjs/common';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { MailService } from './mail.service';
// import { ScheduleModule } from '@nestjs/schedule';
// import { User } from 'src/entities/user.entity';
// import { TypeOrmModule } from '@nestjs/typeorm';

// @Module({
//   imports: [
//     MailerModule.forRootAsync({
//       imports: [ConfigModule, ScheduleModule.forRoot()],
//       inject: [ConfigService],
//       useFactory: async (config: ConfigService) => ({
//         transport: {
//             host: "smtp-relay.brevo.com",  // 'smtp-relay.sendinblue.com',smtp-relay.brevo.com
//             port: 587,
//             secure: false,  // Usar `true` si es SSL
//             auth: {
//             user: 'apikey', // Fijo para Brevo
//             pass: config.get<string>('BREVO_API_KEY'),
//             },
//             tls: {
//                 rejectUnauthorized: false, // Desactiva la verificación del certificado (solo para desarrollo)
//             },
//         },
//         defaults: {
//             from: config.get<string>('EMAIL_FROM'),
//         },
//       }),
//     }),
//     TypeOrmModule.forFeature([User]), // Si es un repositorio TypeORM
//   ],
//   providers: [MailService],
//   exports: [MailService],
// })
// export class MailModule {}


import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';
import { ScheduleModule } from '@nestjs/schedule';
import { User } from 'src/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule, ScheduleModule.forRoot()],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: "smtp-relay.brevo.com",  
          port: 587,  // Puedes probar con 465 si necesitas SSL
          secure: false,  // Cambia a `true` si usas el puerto 465
          auth: {
            user: config.get<string>('BREVO_SMTP_USER'), 
            pass: config.get<string>('BREVO_SMTP_PASS'),
          },
          tls: {
            rejectUnauthorized: false, // Solo para desarrollo, desactiva en producción
          },
        },
        defaults: {
          from: config.get<string>('EMAIL_FROM'),
        },
      }),
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
