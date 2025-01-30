import { Injectable } from '@nestjs/common';
import mercadopago from 'mercadopago';

@Injectable()
export class PaymentService {
  constructor() {
    // Configuración del cliente de Mercado Pago
    mercadopago.configure({
      access_token: 'YOUR_ACCESS_TOKEN', // Reemplaza con tu token de Mercado Pago
    });
  }

  async createPayment(paymentData: any) {
    try {
      // Crear un pago utilizando la API de MercadoPago
      const response = await mercadopago.payment.create(paymentData);

      // Retornar la respuesta del cuerpo
      return response.body;
    } catch (error) {
      console.error('Error creando el pago:', error);
      throw new Error(`Error creando el pago: ${error.message}`);
    }
  }

  async getPaymentStatus(paymentId: number) {
    try {
      // Obtener el estado de un pago utilizando la API de MercadoPago
      const response = await mercadopago.payment.get(paymentId);

      // Retornar el estado del pago
      return response.body;
    } catch (error) {
      console.error('Error obteniendo el estado del pago:', error);
      throw new Error(`Error obteniendo el estado del pago: ${error.message}`);
    }
  }
}
