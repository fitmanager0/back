import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthsheetController } from './healthsheet.controller';
import { HealthsheetService } from './healthsheet.service';
import { HealthSheet } from '../entities/helthsheet.entity';
import { User } from '../entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([HealthSheet, User]),UserModule,JwtModule],
  controllers: [HealthsheetController],
  providers: [HealthsheetService],
})
export class HealthsheetModule {}