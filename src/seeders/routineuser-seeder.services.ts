//seeder para crear los niveles y las rutinas de los usuarios

import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Routine } from '../entities/routine.entity';
import { Level } from '../entities/level.entity';

@Injectable()
export class RoutineUserSeederService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Routine)
    private readonly routineRepository: Repository<Routine>,

    @InjectRepository(Level)
    private readonly levelRepository: Repository<Level>,
  ) {}

  async seed(): Promise<void> {
    console.log('Iniciando la precarga de niveles y rutinas...');
    await this.seedLevels();
    await this.seedRoutines();
    console.log('Precarga de niveles y rutinas completada.');
  }

  private async seedLevels(): Promise<void> {
    const levels = [
      { id_level: '1', description: 'Inicial' },
      { id_level: '2', description: 'Intermedio' },
      { id_level: '3', description: 'Avanzado' },
    ];

    for (const level of levels) {
      const existingLevel = await this.levelRepository.findOne({ where: { id_level: level.id_level } });
      if (!existingLevel) {
        const newLevel = this.levelRepository.create(level);
        await this.levelRepository.save(newLevel);
        console.log(`Nivel ${level.description} creado.`);
      }
    }
  }

  private async seedRoutines(): Promise<void> {
    const users = await this.userRepository.find({ where: { id_rol: 3 } });

    for (const user of users) {
      const existingRoutine = await this.routineRepository.findOne({ where: { user: { id_user: user.id_user } } });
      if (!existingRoutine) {
        const id_level = Math.floor(Math.random() * 3) + 1; // Nivel aleatorio entre 1 y 3
        const routineUrl = `https://cloudinary.com/routine-${user.id_user}.pdf`;

        const routine = this.routineRepository.create({
          user,
          level: { id_level: id_level.toString() } as Level,
          url_routine: routineUrl,
        });

        await this.routineRepository.save(routine);
        console.log(`Rutina para el usuario ${user.name} creada con nivel ${id_level}.`);
      }
    }
  }

  async onModuleInit(): Promise<void> {
    await this.seed();
  }
}
