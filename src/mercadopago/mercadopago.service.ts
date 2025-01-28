import { Injectable } from '@nestjs/common';
import { MercadoPagoConfig } from 'mercadopago';

@Injectable()
export class MercadoPagoService {
  private client: MercadoPagoConfig;

  constructor() {
    this.client = new MercadoPagoConfig({
      accessToken: 'TEST-5878728462675955-012721-77e5e194ffc961479a6d39c51359a8a9-1272054697', 
      options: { timeout: 5000 },
    });
  }

  getClient(): MercadoPagoConfig {
    return this.client;
  }
}
