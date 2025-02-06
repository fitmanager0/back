import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';

@Entity('comments')
export class Comment {
    @ApiProperty({ description: 'Identificador único del comentario' })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ description: 'Contenido del comentario' })
    @Column({ type: 'text', nullable: false })
    content: string;

    @Column({ type: 'int', default: 5 })
    rating: number;

    @ApiProperty({ description: 'Fecha de creación del comentario' })
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty({ description: 'Usuario que hizo el comentario' })
    @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
    user: User;
}
