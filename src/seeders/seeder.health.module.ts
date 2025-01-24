import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { HealthSheet } from 'src/entities/helthsheet.entity';
import { HealthUserSeederService } from './healthuser.seeder.service';




@Module({
  imports: [
    TypeOrmModule.forFeature([User, HealthSheet ]), 
  ],
  providers: [HealthUserSeederService],
})
export class  HealthSeederModule{}