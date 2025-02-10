import { Injectable, Logger } from '@nestjs/common';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import type { PreferenceCreateData } from 'mercadopago/dist/clients/preference/create/types';
import { UserService } from '../../user/user.service';

@Injectable()
export class MercadoPagoService {
  private readonly logger = new Logger(MercadoPagoService.name);

  private readonly successURL = process.env.SUCCESS_PAYMENT_URL || '';
  private readonly failureURL = process.env.FAILURE_PAYMENT_URL || '';
  private readonly pendingURL = process.env.PENDING_PAYMENT_URL || '';
  private readonly frontendURL = process.env.FRONTEND_URL || '';

  private client: MercadoPagoConfig;

  constructor(private readonly userService: UserService) {
    if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
      this.logger.error(
        'MERCADOPAGO_ACCESS_TOKEN no está configurado en las variables de entorno.',
      );
      throw new Error(
        'MERCADOPAGO_ACCESS_TOKEN es obligatorio en las variables de entorno.',
      );
    }

    try {
      this.client = new MercadoPagoConfig({
        accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
      });
      this.logger.log('MercadoPago configurado exitosamente');
    } catch (error: any) {
      this.logger.error('Error al configurar MercadoPago:', error.message);
      throw new Error('Error al configurar MercadoPago');
    }
  }

  async createPreference(
    product: { title: string; price: number },
    userId: string,
    userEmail: string,
  ) {
    this.logger.log(
      `Creando preferencia para producto: ${JSON.stringify(product)}`,
    );

    const preferenceData: PreferenceCreateData = {
      body: {
        items: [
          {
            id: '1',
            title: product.title,
            unit_price: product.price,
            quantity: 1,
            currency_id: 'ARS',
          },
        ],
        auto_return: 'approved',
        back_urls: {
          success: this.successURL,
          failure: this.failureURL,
          pending: this.pendingURL,
        },
        payer: {
          email: userEmail,
          name: 'Lalo',
          surname: 'Landa',
          identification: {
            type: 'DNI',
            number: '22333444',
          },
        },
        payment_methods: {
          excluded_payment_types: [{ id: 'ticket' }, { id: 'atm' }],
          installments: 1,
        },
        binary_mode: true,
        expires: false,
        statement_descriptor: 'Tu Empresa',
        external_reference: userId,
      },
    };

    try {
      const preferenceClient = new Preference(this.client);
      const response = await preferenceClient.create(preferenceData);
      this.logger.log('Preferencia creada exitosamente:', response);

      try {
        const activationResult =
          await this.userService.activateUserById(userId);
        this.logger.log(
          `Usuario activado: ${JSON.stringify(activationResult)}`,
        );
      } catch (error: any) {
        this.logger.error('Error al activar el usuario:', error.message);
        throw new Error(`Error al activar el usuario: ${error.message}`);
      }
      return {
        id: response.id,
        init_point: response.init_point,
        status: 'created',
      };
    } catch (error: any) {
      const errorDetails = error.response?.data || error.message;
      this.logger.error('Error al crear la preferencia:', errorDetails);
      throw new Error(`Error al crear la preferencia: ${errorDetails}`);
    }
  }

  async checkPaymentStatus(paymentId: string) {
    try {
      return { status: 'approved' }; // Simulación de estado aprobado
    } catch (error: any) {
      this.logger.error(
        'Error al verificar el estado del pago:',
        error.message,
      );
      throw new Error(
        `Error al verificar el estado del pago: ${error.message}`,
      );
    }
  }
}
