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

@Entity('users')
export class User {
  @ApiProperty({
    description: 'Identificador único del usuario',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id_user: string;

  @ApiProperty({
    description:
      'Nombre y Apellido del usuario. Campo de tipo string el cual no debe superar los 50 caracteres.',
    example: 'Juan Pérez',
  })
  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @ApiProperty({
    description:
      'Correo electrónico del usuario. Campo de tipo string, único y no debe superar los 50 caracteres.',
    example: 'juan.perez@example.com',
  })
  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario. Campo de tipo string.',
    example: 'ContraseñaSegura123',
  })
  @Column({ type: 'varchar', length: 100, nullable: false })
  password: string;

  @ApiProperty({
    description: 'Identificador del rol. Campo de tipo número entero.',
    example: 1,
  })
  @Column({ type: 'int', nullable: false })
  id_rol: number;

  @ApiProperty({
    description: 'Fecha de nacimiento del usuario. Campo tipo Date.',
    example: '1990-01-01',
  })
  @Column({ type: 'date', nullable: true })
  birthdate: Date | null;

  @ApiProperty({
    description: 'Número de teléfono del usuario. Campo de tipo número entero.',
    example: 1234567890,
  })
  @Column({ type: 'int', nullable: true })
  phone: number | null;

  @ApiProperty({
    description: 'Dirección de residencia del usuario. Campo tipo string.',
    example: 'Avenida Siempre Viva 123',
  })
  @Column({ type: 'varchar', length: 50, nullable: true })
  address: string | null;

  @ApiProperty({
    description: 'Ciudad del usuario. Campo de tipo string.',
    example: 'Ciudad de Buenos Aires',
  })
  @Column({ type: 'varchar', length: 50, nullable: true })
  city: string | null;

  @ApiProperty({
    description: 'País del usuario. Campo de tipo string.',
    example: 'Argentina',
  })
  @Column({ type: 'varchar', length: 50, nullable: true })
  country: string | null;

  @ApiProperty({
    description: 'Indica si el usuario está activo. Campo de tipo Boolean.',
    example: true,
  })
  @Column({ type: 'boolean', nullable: false })
  isActive: boolean;

  @ApiProperty({
    description: 'Fecha de registro del usuario. Campo de tipo Date.',
    example: '2023-01-01',
  })
  @Column({ type: 'date', nullable: false })
  entry_date: Date;

  @ApiProperty({ description: 'Hoja de salud relacionada con el usuario' })
  @OneToOne(() => HealthSheet, (healthSheet) => healthSheet.user, {
    nullable: true,
    onDelete: 'SET NULL', // Esto asegura que no se rompa la relación si se elimina el HealthSheet
  })
  @JoinColumn({ name: 'id_user' })
  healthSheet: HealthSheet | null;

  @ApiProperty({ description: 'Pagos asociados al usuario' })
  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment[];

  @ApiProperty({ description: 'Rutinas asociadas al usuario' })
  @OneToMany(() => Routine, (routine) => routine.user)
  routines: Routine[];

  @ApiProperty({ description: 'Rol asociado al usuario, si existe.' })
  @ManyToOne(() => Role, (role) => role.users, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'id_rol' })
  role?: Role;
}
