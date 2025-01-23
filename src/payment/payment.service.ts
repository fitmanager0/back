import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../entities/payments.entity';
import { CreatePaymentDto } from '../dtos/create-payment.dto';
import { UpdatePaymentDto } from '../dtos/update-payment.dto';
import { User } from 'src/entities/user.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,

    @InjectRepository(User) // Inyectamos el repositorio de User
    private readonly userRepository: Repository<User>,
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

  async create(createPaymentDto: CreatePaymentDto) {
    try {
      // Obtener el userId desde el DTO
      const { userId } = createPaymentDto; // Aquí estamos usando userId, como está en el DTO

      // Verificar si el usuario existe en la base de datos
      const user = await this.userRepository.findOne({
        where: { id_user: userId },
      });

      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      // Crear el pago con la relación al usuario
      const payment = this.paymentRepository.create({
        ...createPaymentDto, // Resto de los datos
        user, // Asociamos el usuario correctamente
      });

      return await this.paymentRepository.save(payment);
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
