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
    @Param('userId') userId: number,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentsService.create(userId, createCommentDto);
  }

  @Get('resource/:resourceId')
  async getCommentsByResource(@Param('resourceId') resourceId: number) {
    return this.commentsService.findByResource(resourceId);
  }
}
