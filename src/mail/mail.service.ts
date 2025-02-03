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

    @Cron('0 0 1 * *') // Se ejecuta el 1° de cada mes a la medianoche
    async sendMonthlyPromotions() {
        const users = await this.userRepository.find(); // Obtener todos los usuarios
        for (const user of users) {
            await this.sendMonthlyPromotion(user.email, user.name);
        }
    }

    @Cron('0 8 * * *') // Se ejecuta cada día a las 8 AM
    async sendBirthdayEmails() {
        const today = new Date().toISOString().slice(5, 10); // Formato MM-DD
        const users = await this.userRepository.find();
      
        for (const user of users) {
            if (user.birthdate?.toISOString().slice(5, 10) === today) {
            await this.sendBirthdayEmail(user.email, user.name);
        }
      }
    }
      

//📩 1) Enviar correo de bienvenida


    async sendWelcomeEmail(to: string, name: string) {
        await this.mailerService.sendMail({
        to,
        subject: 'Bienvenido a FitManager, ' + name + ' 🎉',
        from: 'fitmanager.henry@gmail.com', // Asegúrate de que este email esté autenticado en Brevo
        replyTo: 'fitmanager.henry@gmail.com',
        text: `Hola ${name},  
        
        ¡Bienvenido a FitManager! Estamos muy contentos de que te hayas unido a nuestra comunidad.  

        Aquí tienes algunos recursos para empezar:  
        - Accede a tu cuenta: [https://fitmanager.com/login](https://fitmanager.com/login)  
        - Explora nuestras funcionalidades: [https://fitmanager.com/features](https://fitmanager.com/features)  

        Si tienes alguna duda, simplemente responde a este correo y nuestro equipo te ayudará.  

        Saludos,  
        El equipo de FitManager  
        `,

        html: `
            <p>Hola <strong>${name}</strong>,</p>
            <p>¡Bienvenido a <strong>FitManager</strong>! Estamos muy contentos de que te hayas unido a nuestra comunidad.</p>
            <p>Aquí tienes algunos recursos para empezar:</p>
            <ul>
            <li>📌 <a href="https://fitmanager.com/login">Accede a tu cuenta</a></li>
            <li>🚀 <a href="https://fitmanager.com/features">Explora nuestras funcionalidades</a></li>
            </ul>
            <p>Si tienes alguna duda, simplemente responde a este correo y nuestro equipo te ayudará.</p>
            <p>Saludos,<br>El equipo de FitManager</p>
        `,
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
      subject: 'Recuperación de contraseña',
      html: `<p>Hemos recibido una solicitud para restablecer tu contraseña.</p>
             <p>Haz clic en el siguiente enlace para restablecerla:</p>
             <a href="${resetLink}">${resetLink}</a>
             <p>Si no solicitaste este cambio, puedes ignorar este mensaje.</p>`,
    });
  }
}
