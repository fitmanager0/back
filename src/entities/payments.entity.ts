import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';

@Entity('payments')
export class Payment {
  @ApiProperty({
    description: 'Identificador único del pago',
    example: '1b2c3d4e-5f6g-7h8i-9j0k-l1m2n3o4p5q6',
  })
  @PrimaryGeneratedColumn('uuid')
  uid: string;

  @ApiProperty({
    description: 'Clave foránea que referencia al usuario que realizó el pago',
    example: '2e3f4g5h-6i7j-8k9l-0m1n-2o3p4q5r6s7t',
  })
  @ManyToOne(() => User, (user) => user.payments, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_user' })
  id_user: User;

  @ApiProperty({
    description: 'Fecha en la que se realizó el pago',
    example: '2025-01-20 10:30',
  })
  @Column({ type: 'timestamp', nullable: false })
  pay_date: Date;

  @ApiProperty({
    description: 'Fecha de inicio de la suscripción',
    example: '2025-01-01 00:00',
  })
  @Column({ type: 'timestamp', nullable: false })
  initial_subscription_date: Date;

  @ApiProperty({
    description: 'Fecha de finalización de la suscripción',
    example: '2025-12-31 23:59',
  })
  @Column({ type: 'timestamp', nullable: false })
  final_subscription_date: Date;

  @ApiProperty({
    description: 'Monto pagado por el usuario',
    example: 49.99,
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  amount: number;
}
