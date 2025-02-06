import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createComment(userId: string, content: string, rating: number): Promise<Comment> {
    if (rating < 1 || rating > 5) {
      throw new Error('La calificación debe estar entre 1 y 5');
    }

    const user = await this.userRepository.findOne({ where: { id_user: userId } });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const comment = this.commentRepository.create({
      content,
      rating,
      user, 
    });

    return this.commentRepository.save(comment);
  }

  async getCommentsByUser(userId: string): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { user: { id_user: userId } },
      relations: ['user'],
    });
  }
}
