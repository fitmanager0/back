import { Injectable } from '@nestjs/common';
import { Payment } from 'mercadopago';
import { MercadoPagoService } from '../mercadopago.service';

@Injectable()
export class PaymentService {
  private paymentApi: Payment;

  constructor(private readonly mercadoPagoService: MercadoPagoService) {
    const client = this.mercadoPagoService.getClient();
    this.paymentApi = new Payment(client); // Inicializa la API de pagos
  }

  async createPayment(data: {
    transaction_amount: number;
    description: string;
    payment_method_id: string;
    payer: { email: string };
  }) {
    try {
      const body = {
        transaction_amount: data.transaction_amount,
        description: data.description,
        payment_method_id: data.payment_method_id,
        payer: {
          email: data.payer.email,
        },
      };

    const response: any = await this.paymentApi.create({ body });
    return response.body || response;

    } catch (error) {
      throw new Error(`Error creating payment: ${error.message}`);
    }
  }
}
