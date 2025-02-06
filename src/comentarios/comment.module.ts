import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsController } from './comment.controller';
import { CommentsService } from './comment.services';
import { Comment } from '../entities/comment.entity';
import { User } from '../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, User])],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
