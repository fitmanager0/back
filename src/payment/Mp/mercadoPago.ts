import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import mercadopago from 'mercadopago';
import type { CreatePreferencePayload } from 'mercadopago/models/preferences/create-payload.model';

@Injectable()
export class MercadoPagoService {
  constructor(private configService: ConfigService) {
    // Configuramos MercadoPago con el token de acceso
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

  // Crear una preferencia de pago
  async createPreference(product: { title: string; price: number }) {
    const URL = this.configService.get<string>('NOTIFICATION_URL');
    const FRONTEND_URL = this.configService.get<string>('FRONTEND_URL');

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
          success: `${FRONTEND_URL}/success`,
          failure: `${FRONTEND_URL}/failure`,
          pending: `${FRONTEND_URL}/pending`,
        },
        notification_url: `${URL}/payment/notify`,
      };

      // Crear la preferencia con MercadoPago
      const response = await mercadopago.preferences.create(preference);

      // Retornar la URL de redirección
      return { url: response.body.init_point };
    } catch (error) {
      console.error('Error al crear la preferencia de Mercado Pago:', error);
      throw new Error('Error al generar la preferencia');
    }
  }

  // Manejar las notificaciones de MercadoPago
  async handleNotification(query: any) {
    const topic = query.topic || query.type;

    try {
      if (topic === 'payment') {
        const paymentId = query.id || query['data.id'];

        // Buscar el pago por ID
        const payment = await mercadopago.payment.get(paymentId);
        const paymentStatus = payment.body.status;

        console.log('Estado del pago:', paymentStatus);

        // Aquí puedes implementar lógica adicional
        return { status: 'success', paymentStatus };
      }

      throw new Error('Notificación desconocida');
    } catch (error) {
      console.error(
        'Error al procesar la notificación de Mercado Pago:',
        error,
      );
      throw new Error('Error procesando la notificación');
    }
  }
}
