import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Level } from 'src/entities/level.entity';
import { Routine } from 'src/entities/routine.entity';
import { RoutineUserSeederService } from './routineuser-seeder.services';



@Module({
  imports: [
    TypeOrmModule.forFeature([User, Level, Routine ]), 
  ],
  providers: [RoutineUserSeederService],
})
export class  RoutineSeederModule{}