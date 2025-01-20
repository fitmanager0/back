import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Routine } from './routine.entity';

@Entity('levels')
export class Level {
  @ApiProperty({
    description: 'Identificador único del nivel',
    example: '1b2c3d4e-5f6g-7h8i-9j0k-l1m2n3o4p5q6',
  })
  @PrimaryGeneratedColumn('uuid')
  id_level: string;

  @ApiProperty({
    description: 'Descripción del nivel de la rutina',
    example: 'Beginner',
  })
  @Column({ type: 'varchar', length: 20, nullable: false })
  description: string;

  @OneToMany(() => Routine, (routine) => routine.level)
  routines: Routine[];
}
