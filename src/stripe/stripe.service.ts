import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
import Stripe from 'stripe';
import { Payment } from '../entities/payments.entity';
import { User } from '../entities/user.entity';  // Asegúrate de importar la entidad User

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(User)
    private userRepository: Repository<User>, // Asegúrate de inyectar el repositorio de User
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2025-01-27.acacia' });
}

  async createPaymentIntent(amount: number, currency: string, userId: string, paymentDate: string) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    // Obtener el usuario completo
    const user = await this.userRepository.findOne({ where: { id_user: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const metadata = { userId, paymentDate };
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amount * 100,  // Stripe espera el monto en centavos
      currency,
      metadata,
      automatic_payment_methods: { enabled: true },
    });

    // Crear el pago con el usuario completo
    const payment = this.paymentRepository.create({
      user,
      amount,
      pay_date: new Date(paymentDate),
      initial_subscription_date: new Date(paymentDate),  // Establecer fechas si es necesario
      final_subscription_date: new Date(paymentDate),    // Ajustar según lo que corresponda
    });

    // Guardar el pago
    await this.paymentRepository.save(payment);

    return { clientSecret: paymentIntent.client_secret };
  }

  async isPremiumRight(id: string): Promise<boolean> {
    const payment = await this.paymentRepository.findOne({
        where: { user: { id_user: id }, final_subscription_date: IsNull() },
    });
    return !!payment;
  }

  async getMonthlyEarnings() {
    return this.paymentRepository.createQueryBuilder('payment')
      .select("TO_CHAR(payment.pay_date, 'YYYY-MM')", 'name')
      .addSelect('SUM(payment.amount) / 100', 'total')
      .groupBy("TO_CHAR(payment.pay_date, 'YYYY-MM')")
      .orderBy('name', 'ASC')
      .getRawMany();
  }

  async getTotalEarnings(): Promise<number> {
    const result = await this.paymentRepository.createQueryBuilder('payment')
      .select('SUM(payment.amount)/100', 'total')
      .getRawOne();
    return result?.total ? result.total : 0;
  }
}
