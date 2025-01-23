import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('rol')
export class Role {
  @ApiProperty({
    description: 'Identificador único del rol',
    example: '1',
  })
  @PrimaryGeneratedColumn({ type: 'int' })
  id_role: number;

  @Column({ length: 20 })
  @ApiProperty({
    description: 'Descripción del rol',
    example: 'administrador | entrenador | socio',
  })
  description: string;

  // @OneToMany(() => User, (user) => user.role)
  // users: User[];
}
