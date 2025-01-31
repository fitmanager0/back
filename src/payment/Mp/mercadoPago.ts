import { Injectable, Logger } from '@nestjs/common';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { PreferenceCreateData } from 'mercadopago/dist/clients/preference/create/types';

@Injectable()
export class MercadoPagoService {
  private readonly logger = new Logger(MercadoPagoService.name);
  private readonly ngrokURL = 'https://4680-186-148-116-135.ngrok-free.app';
  private readonly frontendURL = 'http://localhost:3001/home';
  private client: MercadoPagoConfig;

  constructor() {
    try {
      this.client = new MercadoPagoConfig({
        accessToken: 'APP_USR-3549561525679930-012917-7126929ae757c57e1358abbcf1041373-2238960556',
      });
      this.logger.log('MercadoPago configurado exitosamente');
    } catch (error) {
      this.logger.error('Error al configurar MercadoPago:', error.message);
      throw new Error('Error al configurar MercadoPago');
    }
  }

  async createPreference(product: { title: string; price: number }) {
    this.logger.log(`Creando preferencia para producto: ${JSON.stringify(product)}`);

    const preferenceData: PreferenceCreateData = {
      body: {
        items: [
          {
            id: '1', // Add an id for each item
            title: product.title,
            unit_price: product.price,
            quantity: 1,
            currency_id: 'ARS', // Specify the currency
          },
        ],
        auto_return: 'approved',
        back_urls: {
          success: `${this.frontendURL}`,
          failure: `${this.frontendURL}`,
          pending: `${this.frontendURL}`,
        },
        notification_url: `${this.ngrokURL}/payment/notify`,
      },
    };

    try {
      const preferenceClient = new Preference(this.client);
      const response = await preferenceClient.create(preferenceData);
      this.logger.log('Preferencia creada exitosamente:', response);
      return { id: response.id, init_point: response.init_point };
    } catch (error) {
      this.logger.error('Error al crear la preferencia:', error.message);
      throw new Error(`Error al crear la preferencia: ${error.message}`);
    }
  }

  async handleNotification(query: any) {
    this.logger.log('Procesando notificación recibida:', query);

    const topic = query.topic || query.type;
    if (topic === 'payment') {
      const paymentId = query.id || query['data.id'];
      this.logger.log('ID de pago recibido:', paymentId);

      try {
        const paymentClient = new Payment(this.client);
        const payment = await paymentClient.get({ id: paymentId });
        this.logger.log('Estado del pago:', payment.status);
        return { status: payment.status };
      } catch (error) {
        this.logger.error('Error al obtener el pago:', error.message);
        throw new Error(`Error al obtener el pago: ${error.message}`);
    }
  }

    this.logger.warn('Notificación no procesada');
    return { message: 'Notificación no procesada' };
  }
}