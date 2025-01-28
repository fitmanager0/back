import { Module } from '@nestjs/common';
import { MercadoPagoService } from './mercadopago.service';
import { PaymentService } from './payment/payment.service';
import { PaymentController } from './payment/payment.controller';

@Module({
  providers: [MercadoPagoService, PaymentService],
  exports: [MercadoPagoService],
  controllers: [PaymentController],
})
export class MercadoPagoModule {}
