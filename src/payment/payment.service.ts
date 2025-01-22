import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../entities/payments.entity';
import { CreatePaymentDto } from '../dtos/create-payment.dto';
import { UpdatePaymentDto } from '../dtos/update-payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  findAll() {
    try {
      return this.paymentRepository.find();
    } catch (error) {
      console.error('Error fetching all payments:', error);
      throw new HttpException(
        'Error al obtener los pagos',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  findOne(id: string) {
    try {
      return this.paymentRepository.findOne({ where: { uid: id } });
    } catch (error) {
      console.error('Error fetching payment by id:', error);
      throw new HttpException(
        'Error al obtener el pago',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  create(createPaymentDto: CreatePaymentDto) {
    try {
      const payment = this.paymentRepository.create(createPaymentDto);
      return this.paymentRepository.save(payment);
    } catch (error) {
      console.error('Error creating payment:', error);
      throw new HttpException(
        'Error al crear el pago',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto) {
    try {
      await this.paymentRepository.update(id, updatePaymentDto);
      return this.paymentRepository.findOne({ where: { uid: id } });
    } catch (error) {
      console.error('Error updating payment:', error);
      throw new HttpException(
        'Error al actualizar el pago',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    try {
      await this.paymentRepository.delete(id);
      return { deleted: true };
    } catch (error) {
      console.error('Error removing payment:', error);
      throw new HttpException(
        'Error al eliminar el pago',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
