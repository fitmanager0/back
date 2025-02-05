import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Payment } from 'src/entities/payments.entity';
import { PayUserSeederService } from './payuser-seeder.services';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Payment]), 
  ],
  providers: [PayUserSeederService],
})
export class PaySeederModule {}
