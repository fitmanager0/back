import { Injectable } from '@nestjs/common';
import * as mercadopago from 'mercadopago';

@Injectable()
export class MercadoPagoService {
  constructor() {
    mercadopago.configure({
      access_token: 'TEST-ACCESS-TOKEN',
    });
  }

  getClient() {
    return mercadopago;
  }
}
