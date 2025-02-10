import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { Payment } from '../entities/payments.entity';
import { User } from 'src/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { MercadoPagoService } from './Mp/mercadoPago';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, User]), UserModule],
  controllers: [PaymentController],
  providers: [PaymentService, MercadoPagoService, MailService],
})
export class PaymentModule {}
