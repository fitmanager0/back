import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ContactUsDto } from '../dtos/contactus.dto';

@Injectable()
export class ContactUsService {
  constructor(private readonly mailerService: MailerService) {}

  async sendContactEmail(contactUsDto: ContactUsDto) {
    try {
      await this.mailerService.sendMail({
        to: 'fitmanager.henry@gmail.com',
        subject: `Nuevo mensaje de contacto de ${contactUsDto.name}`,
        text: `Nombre: ${contactUsDto.name}\nEmail: ${contactUsDto.email}\nMensaje: ${contactUsDto.message}`,
        html: `<p><strong>Nombre:</strong> ${contactUsDto.name}</p><p><strong>Email:</strong> ${contactUsDto.email}</p><p><strong>Mensaje:</strong> ${contactUsDto.message}</p>`
      });
      return { success: true, message: 'Correo enviado correctamente' };
    } catch (error) {
      return { success: false, message: 'Error al enviar el correo', error };
    }
  }
}
