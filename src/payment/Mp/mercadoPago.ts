import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import mercadopago from 'mercadopago';
import { CreatePreferencePayload } from 'mercadopago/models/preferences/create-payload.model';

@Injectable()
export class MercadoPagoService {
  constructor(private configService: ConfigService) {
    const accessToken = this.configService.get<string>('MP_ACCESS_TOKEN');
    if (!accessToken) {
      throw new Error(
        'MP_ACCESS_TOKEN no está definido en las variables de entorno',
      );
    }
    mercadopago.configure({
      access_token: accessToken,
    });
  }

  async createPreference(product: any) {
    const URL = this.configService.get<string>('NOTIFICATION_URL');

    try {
      const preference: CreatePreferencePayload = {
        items: [
          {
            title: product.title,
            unit_price: product.price,
            quantity: 1,
          },
        ],
        auto_return: 'approved',
        back_urls: {
          success: `${this.configService.get<string>('FRONTEND_URL')}`,
          failure: `${this.configService.get<string>('FRONTEND_URL')}`,
        },
        notification_url: `${URL}/payment/notify`,
      };

      const response = await mercadopago.preferences.create(preference);

      return { url: response.body.init_point };
    } catch (error) {
      console.error('Error al crear la preferencia de Mercado Pago:', error);
      throw new Error('Error al generar la preferencia');
    }
  }

  async handleNotification(query: any) {
    const topic = query.topic || query.type;

    console.log({ query, topic });

    try {
      if (topic === 'payment') {
        const paymentId = query.id || query['data.id'];
        let payment = await mercadopago.payment.findById(Number(paymentId));
        let paymentStatus = payment.body.status;

        console.log([payment, paymentStatus]);

        // Here you can add your logic to handle the payment status
        // For example, update your database, send emails, etc.

        return { status: 'success', paymentStatus };
      }
    } catch (error) {
      console.error('Error handling MercadoPago notification:', error);
      throw new Error('Error processing MercadoPago notification');
    }
  }
}
