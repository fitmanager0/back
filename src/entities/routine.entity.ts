import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Level } from './level.entity';
import { User } from './user.entity';

@Entity('routines')
export class Routine {
  @ApiProperty({
    description: 'Identificador único de la rutina',
    example: '2e3f4g5h-6i7j-8k9l-0m1n-2o3p4q5r6s7t',
  })
  @PrimaryGeneratedColumn('uuid')
  id_routine: string;

  @ApiProperty({
    description: 'URL de la rutina',
    example: 'https://example.com/routine1',
  })
  @Column({ type: 'varchar', length: 100, nullable: false })
  url_routine: string;

  @ApiProperty({
    description: 'Clave foránea que referencia al usuario que creó la rutina',
    example: '3f4g5h6i-7j8k-9l0m-1n2o-3p4q5r6s7t8u',
  })
  @ManyToOne(() => User, (user) => user.routines, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_user' })
  user: User;

  @ApiProperty({
    description: 'Clave foránea que referencia al nivel de la rutina',
    example: '1b2c3d4e-5f6g-7h8i-9j0k-l1m2n3o4p5q6',
  })
  @ManyToOne(() => Level, (level) => level.routines, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_level' })
  level: Level;
}
