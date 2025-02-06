import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { CommentsService } from './comment.services';
import { CreateCommentDto } from '../dtos/create-comment.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post(':userId')
  async createComment(
    @Param('userId') userId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentsService.create(userId, createCommentDto);
  }

  @Get('rating/:rating')
  async getCommentsByRating(@Param('rating') rating: number) {
    return this.commentsService.findByRating(rating);
  }

  @Get()
  async getAllComments() {
    return this.commentsService.getAllComments();
  }
}
