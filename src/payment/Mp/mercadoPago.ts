import { Injectable } from '@nestjs/common';
import * as mercadopago from 'mercadopago';

@Injectable()
export class MercadoPagoService {
  constructor() {
    mercadopago.configurations.setAccessToken(
      process.env.MERCADOPAGO_ACCESS_TOKEN ||
        'APP_USR-3549561525679930-012917-7126929ae757c57e1358abbcf1041373-2238960556',
    );
  }

  async createPreference(preference: { title: string; price: number }) {
    const preferenceData = {
      items: [
        {
          title: preference.title,
          unit_price: preference.price,
          quantity: 1,
        },
      ],
    };

    try {
      console.log('Creando preferencia con datos:', preferenceData);
      const response = await mercadopago.preferences.create(preferenceData);
      console.log('Respuesta de MercadoPago:', response.body);
      return { init_point: response.body.init_point };
    } catch (error) {
      console.error('Error creando preferencia:', error.message);
      throw new Error(`Error creating preference: ${error.message}`);
    }
  }

  async handleNotification(notification: any) {
    console.log('Procesando notificación de MercadoPago:', notification);

    const { type, data } = notification;

    if (notification.type === 'payment') {
      const paymentInfo = await mercadopago.payment.get(notification.data.id);
      return paymentInfo.body;
    } else {
      console.warn('Tipo de notificación no soportado:', notification.type);
    }

    console.warn('Tipo de notificación no soportado:', type);
    return { message: 'Notificación procesada' };
  }
}
