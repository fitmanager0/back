import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '../entities/comment.entity';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Comment, User]),
             UserModule
    ],
    controllers: [CommentsController],
    providers: [CommentsService],
})
export class CommentsModule { }
