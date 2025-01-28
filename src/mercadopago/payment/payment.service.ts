import { Injectable } from '@nestjs/common';
import { MercadoPagoConfig, Payment } from 'mercadopago';

@Injectable()
export class PaymentService {
  private client: MercadoPagoConfig;
  private paymentApi: Payment;

  constructor() {
    // Configuración del cliente de Mercado Pago
    this.client = new MercadoPagoConfig({
      accessToken: 'YOUR_ACCESS_TOKEN', // Reemplaza con tu token de Mercado Pago
    });
    this.paymentApi = new Payment(this.client); // Inicializa la API de pagos
  }

  async createPayment(paymentData: any) {
    try {
      // Envía el cuerpo recibido al endpoint de Mercado Pago
      const response = await this.paymentApi.create({ body: paymentData });
      return response.body; // Devuelve la respuesta de Mercado Pago
    } catch (error) {
      throw new Error(`Error creando el pago: ${error.message}`);
    }
  }
}
