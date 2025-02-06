import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { CommentsService } from './comments.service';

@ApiTags('Comentarios') // 🔹 Categoría en Swagger
@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) { }

    @Post(':userId')
    @ApiOperation({ summary: 'Crear un comentario para un usuario' })
    @ApiParam({ name: 'userId', type: String, description: 'ID del usuario' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                content: { type: 'string', example: 'Muy buen servicio' },
                rating: { type: 'integer', minimum: 1, maximum: 5, example: 5 },
            },
        },
    })
    create(
        @Param('userId') userId: string,
        @Body('content') content: string,
        @Body('rating') rating: number,
    ) {
        return this.commentsService.createComment(userId, content, rating);
    }

    @Get(':userId')
    @ApiOperation({ summary: 'Obtener comentarios por ID de usuario' })
    @ApiParam({ name: 'userId', type: String, description: 'ID del usuario' })
    getByUser(@Param('userId') userId: string) {
        return this.commentsService.getCommentsByUser(userId);
    }
}
