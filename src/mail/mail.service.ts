import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Cron } from '@nestjs/schedule';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';



@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
) {}

  // @Cron('0 0 1 * *') // ('*/1 * * * *')Se ejecuta cada minuto (solo para pruebas) //('0 0 1 * *') Se ejecuta el 1° de cada mes a la medianoche
  // async sendMonthlyPromotions() {
  //   const users = await this.userRepository.find(); // Obtener todos los usuarios
  //   for (const user of users) {
  //     console.log('🔔 Enviando emails de promoción (prueba)...');
  //     await this.sendMonthlyPromotion(user.email, user.name);
  //   }
  // }

  @Cron('0 21 * * *') // Se ejecuta a las 9 PM todos los días
  async sendMonthlyPromotions() {
    const users = await this.userRepository.find(); // Obtener todos los usuarios
    for (const user of users) {
      console.log('🔔 Enviando emails de promoción...');
      await this.sendMonthlyPromotion(user.email, user.name);
    }
  }


  @Cron('0 8 * * *') //('*/1 * * * *') Se ejecuta cada minuto (solo para pruebas)//('0 8 * * *') Se ejecuta cada día a las 8 AM
  async sendBirthdayEmails() {
    const today = new Date().toISOString().slice(5, 10); // Formato MM-DD
    console.log(`🔍 Buscando usuarios con cumpleaños hoy: ${today}`);
    const users = await this.userRepository.find();
      
    for (const user of users) {
      if (user.birthdate?.toISOString().slice(5, 10) === today) {
        console.log(`🎉 Enviando email de cumpleaños a: ${user.email}`);
        await this.sendBirthdayEmail(user.email, user.name);
      }
    }
  }
      

  //📩 1) Enviar correo de bienvenida

  async sendWelcomeEmail(to: string, name: string) {
    await this.mailerService.sendMail({
      to,
      subject: `Bienvenido a FitManager, ${name}! 🎉`,
      template: 'welcome', // Usa la plantilla handlebars
      context: { name }, // Pasamos el nombre al template
    });
  }

  // 🎉 2) Enviar promociones al inicio del mes
    async sendMonthlyPromotion(to: string, name: string) {
        await this.mailerService.sendMail({
        to,
        subject: '¡Ofertas especiales para este mes!',
        template: 'promotion',
        context: { name },
        });
    }

  // 🎂 3) Enviar felicitaciones de cumpleaños
  async sendBirthdayEmail(to: string, name: string) {
    await this.mailerService.sendMail({
      to,
      subject: `🎉 ¡Feliz cumpleaños, ${name}!`,
      template: 'birthday',
      context: { name },
    });
  }

  // 🔑 4) Enviar email de recuperación de contraseña
  async sendPasswordResetEmail(to: string, token: string) {
    const resetLink = `https://tugimnasio.com/reset-password?token=${token}`;

    await this.mailerService.sendMail({
      to,
      subject: '¡Ofertas especiales para este mes!',
      template: 'promotion', // Se refiere a "promotion.hbs"
      context: { name },
    });
  }

  async sendPaymentSuccessNotification(to: string, name: string, amount: number) {
    await this.mailerService.sendMail({
      to,
      subject: `¡Pago confirmado, ${name}! ✅`,
      template: 'payment-success', // Usamos el archivo `payment-success.hbs`
      context: { name, amount }, // Datos que se reemplazan en el template
    });
  }

  async sendPaymentFailureNotification(to: string, name: string, amount: number, errorMessage: string) {
    await this.mailerService.sendMail({
      to,
      subject: `Error en tu pago, ${name} ❌`,
      template: 'payment-failure', // Usamos el archivo `payment-failure.hbs`
      context: { name, amount, errorMessage }, // Datos dinámicos
    });
  }
}
