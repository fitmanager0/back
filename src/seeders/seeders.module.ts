import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../entities/roles.entity'; // Asegúrate de que la entidad Role está importada correctamente
import { HealthSheet } from '../entities/helthsheet.entity'; // Importa la entidad HealthSheet
import { UserSeederService } from './user-seeder.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, HealthSheet]), // Añadir HealthSheet aquí
  ],
  providers: [UserSeederService],
})
export class UserSeederModule {}
