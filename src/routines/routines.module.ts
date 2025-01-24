import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Routine } from '../entities/routine.entity';
import { RoutinesService } from './routines.service';
import { RoutinesController } from './routines.controller';
import { User } from 'src/entities/user.entity';
import { Level } from 'src/entities/level.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Routine, User, Level])],
  controllers: [RoutinesController],
  providers: [RoutinesService],
  exports: [RoutinesService],
})
export class RoutinesModule {}
