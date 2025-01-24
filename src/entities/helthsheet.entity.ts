import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { User } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('helthsheet')
export class HealthSheet {
  @PrimaryGeneratedColumn('uuid')
  id_sheet: string;

  @ApiProperty({
    description:
      'Clave foránea que referencia al usuario con la planilla de salud',
    example: '0b8bffdd-a027-41b6-a2c9-f12d8ad1a0ec',
  })
  @OneToOne(() => User, (user) => user.healthSheet, {
    onDelete: 'CASCADE',
    nullable: true, // Hacer la relación opcional
  })
  @JoinColumn({ name: 'id_user' })
  user: User | null; // Asegurar que pueda ser null

  @Column({ length: 100 })
  @ApiProperty({
    description: 'URL de Cloudinary donde se encuentra la planilla de salud',
    example: 'https://res.cloudinary.com/dj0v6zokk',
  })
  urlSheet: string;

  @Column({ default: false })
  @ApiProperty({
    description: 'Indica si la ficha médica es temporal',
    example: true,
  })
  isTemporary: boolean;
}
