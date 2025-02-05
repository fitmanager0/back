// ** mail.controller.ts SOLO LO UTILIZAREMOS PARA PRUEBAS DE PROMOTIONS Y BIRTHDAY **
import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('test-mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get('promo')
  async testPromoEmail() {
    await this.mailService.sendMonthlyPromotions();
    return { message: 'Emails de promoción enviados (prueba manual)' };
  }

  @Get('birthday')
  async testBirthdayEmail() {
    await this.mailService.sendBirthdayEmails();
    return { message: 'Emails de cumpleaños enviados (prueba manual)' };
  }
}
