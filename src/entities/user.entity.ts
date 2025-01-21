import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { HealthSheet } from './helthsheet.entity';
import { Payment } from './payments.entity';
import { Routine } from './routine.entity';
import { Role } from './roles.entity';

@Entity('user')
export class User {
  @ApiProperty({
    description: 'Identificador único del usuario',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id_user: string;

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Juan Pérez',
  })
  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'juan.perez@example.com',
  })
  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'ContraseñaSegura123',
  })
  @Column({ type: 'varchar', length: 100, nullable: false })
  password: string;

  @ApiProperty({
    description: 'Identificador del rol',
    example: 1,
  })
  @Column({ type: 'int', nullable: false })
  id_rol: number;

  @ApiProperty({
    description: 'Fecha de nacimiento del usuario',
    example: '2089-01-01',
  })
  @Column({ type: 'date', nullable: false })
  birthdate: Date;

  @ApiProperty({
    description: 'Número de teléfono del usuario',
    example: 1234567890,
  })
  @Column({ type: 'int', nullable: false })
  phone: number;

  @ApiProperty({
    description: 'Dirección del usuario',
    example: 'Avenida Siempre Viva 123',
  })
  @Column({ type: 'varchar', length: 50, nullable: false })
  address: string;

  @ApiProperty({
    description: 'Ciudad del usuario',
    example: 'Ciudad de Buenos Aires',
  })
  @Column({ type: 'varchar', length: 50, nullable: false })
  city: string;

  @ApiProperty({
    description: 'País del usuario',
    example: 'Argentina',
  })
  @Column({ type: 'varchar', length: 50, nullable: false })
  country: string;

  @ApiProperty({
    description: 'Indica si el usuario está activo',
    example: true,
  })
  @Column({ type: 'boolean', nullable: false })
  isActive: boolean;

  @ApiProperty({
    description: 'Fecha de registro del usuario',
    example: '2023-01-01',
  })
  @Column({ type: 'date', nullable: false })
  entry_date: Date;

  @ApiProperty({ description: 'Ficha de salud asociada al usuario, si existe.' })
  @OneToOne(() => HealthSheet, (healthSheet) => healthSheet.user, { nullable: true, cascade: true })
  healthSheet?: HealthSheet;
  

  @ApiProperty({ description: 'Pagos asociados al usuario' })
  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment[];

  @ApiProperty({ description: 'Rutinas asociadas al usuario' })
  @OneToMany(() => Routine, (routine) => routine.user)
  routines: Routine[];

  @ApiProperty({ description: 'Rol asociado al usuario, si existe.' })
  @ManyToOne(() => Role, (role) => role.users, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_rol' })
  role?: Role;
  
}
