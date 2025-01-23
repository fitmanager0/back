// payuser-seeder.services.ts

import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Payment } from '../entities/payments.entity';

@Injectable()
export class PayUserSeederService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async seed() {
    console.log('Iniciando la precarga de pagos...');
    await this.seedPayments();
    console.log('Precarga de pagos completada.');
  }

  async seedPayments(): Promise<void> {
    // Buscar todos los usuarios con id_rol = 3 (socios)
    const users = await this.userRepository.find({ where: { id_rol: 3 } });

    for (const user of users) {
      const existingPayment = await this.paymentRepository.findOne({
        where: { user: { id_user: user.id_user }, pay_date: this.getRandomDateFromStartOfMonth() },
      });

      if (!existingPayment) {
        const initialSubscriptionDate = this.getRandomDateFromStartOfMonth();
        const finalSubscriptionDate = new Date(initialSubscriptionDate);
        finalSubscriptionDate.setDate(finalSubscriptionDate.getDate() + 30);

        const payment = this.paymentRepository.create({
          user: user,
          pay_date: initialSubscriptionDate,
          initial_subscription_date: initialSubscriptionDate,
          final_subscription_date: finalSubscriptionDate,
          amount: 30000,
        });

        await this.paymentRepository.save(payment);
        console.log(`Pago para el usuario ${user.name} creado.`);
      }
    }
  }

  private getRandomDateFromStartOfMonth(): Date {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const randomTime = startOfMonth.getTime() + Math.random() * (now.getTime() - startOfMonth.getTime());
    return new Date(randomTime);
  }

  async onModuleInit() {
    await this.seed();
  }
}
