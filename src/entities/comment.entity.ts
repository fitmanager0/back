import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';

@Entity('comments')
export class Comment {
  @ApiProperty({
    description: 'Identificador único del comentario',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id_comment: string;

  @ApiProperty({
    description: 'Contenido del comentario',
    example: 'Este es un comentario de prueba',
  })
  @Column({ type: 'text', nullable: false })
  content: string;

  @ApiProperty({
    description: 'Fecha de creación del comentario',
    example: '2023-09-12T10:20:30.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Identificador del recurso al que pertenece el comentario',
    example: 123,
  })
  @Column({ type: 'int', nullable: false })
  resourceId: number;

  @ApiProperty({
    description: 'Usuario que escribió el comentario',
  })
  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_user' })
  user: User;
}
