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
    userId: number,
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    const user = await this.userRepository.findOne(userId);

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
