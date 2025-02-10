import { Module } from '@nestjs/common';
import { ContactUsService } from './contactus.service';
import { ContactUsController } from './contactus.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('BREVO_SMTP_HOST'),
          port: configService.get<number>('BREVO_SMTP_PORT'),
          auth: {
            user: configService.get<string>('BREVO_SMTP_USER'),
            pass: configService.get<string>('BREVO_SMTP_PASS'),
          },
        },
        defaults: {
          from: 'fitmanager.henry@gmail.com',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [ContactUsController],
  providers: [ContactUsService],
})
export class ContactUsModule {}