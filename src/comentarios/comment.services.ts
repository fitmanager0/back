import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { CreateCommentDto } from '../dtos/create-comment.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    userId: string, // Cambiado a string para coincidir con el UUID
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    // Utilizamos findOne o findOneBy con el objeto de condición
    const user = await this.userRepository.findOne({
      where: { id_user: userId },
    });
    // Alternativamente:
    // const user = await this.userRepository.findOneBy({ id_user: userId });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const newComment = this.commentRepository.create({
      ...createCommentDto,
      user,
    });

    return this.commentRepository.save(newComment);
  }

  async findByResource(resourceId: number): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { resourceId },
      relations: ['user'], // Incluye la relación con el usuario
      order: { createdAt: 'DESC' },
    });
  }
}
