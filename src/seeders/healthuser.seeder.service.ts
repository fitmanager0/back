// Seeder para generar fichas médicas para los socios

import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { HealthSheet } from '../entities/helthsheet.entity';

@Injectable()
export class HealthUserSeederService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(HealthSheet)
    private readonly healthSheetRepository: Repository<HealthSheet>,
  ) {}

async onModuleInit() {
  console.log('Iniciando carga de fichas médicas para los socios...');

  const users = await this.userRepository.find({ where: { id_rol: 3 } });

  for (const user of users) {
    if (!user.id_user) {
      console.error(`Usuario sin id_user encontrado: ${user.name}. Se omite la creación de ficha.`);
      continue; // Saltar usuarios sin id_user
    }

    console.log(`Verificando ficha médica para el usuario: ${user.name}...`);

    const existingHealthSheet = await this.healthSheetRepository.findOne({
      where: { user: { id_user: user.id_user } },
    });

    if (existingHealthSheet) {
      console.log(`El usuario ${user.name} ya tiene una ficha médica. Se omite la creación.`);
      continue;
    }

    console.log(`Generando ficha para el usuario: ${user.name}...`);

    const newHealthSheet = this.healthSheetRepository.create({
      user: user,
      urlSheet: `https://res.cloudinary.com/demo/fichas/${user.id_user}.pdf`,
    });

    await this.healthSheetRepository.save(newHealthSheet);

    console.log(`Ficha del socio ${user.name} creada.`);
  }

  console.log('Fichas generadas correctamente.');
}

}
