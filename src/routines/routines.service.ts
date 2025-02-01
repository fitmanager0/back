import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Routine } from '../entities/routine.entity';
import { User } from '../entities/user.entity';
import { Level } from '../entities/level.entity';
import { CreateRoutineDto } from '../dtos/create-routine.dto';

@Injectable()
export class RoutinesService {
  constructor(
    @InjectRepository(Routine)
    private readonly routineRepository: Repository<Routine>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Level)
    private readonly levelRepository: Repository<Level>,
  ) {}

  // Asocia la rutina a un usuario y nivel existentes
  async associateRoutine(createRoutineDto: CreateRoutineDto): Promise<Routine> {
    // Buscar si existe el usuario con el ID proporcionado
    const user = await this.userRepository.findOne({
      where: { id_user: createRoutineDto.id_user },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${createRoutineDto.id_user} not found`);
    }

    // Convertir el id_level de string a number si es necesario
    const levelId = parseInt(createRoutineDto.id_level, 10); // Aquí convertimos el ID a un número

    // Buscar si existe el nivel con el ID proporcionado
    const level = await this.levelRepository.findOne({
      where: { id_level: levelId },
    });

    if (!level) {
      throw new NotFoundException(`Level with ID ${createRoutineDto.id_level} not found`);
    }

    // Crear una nueva rutina asociada al usuario y al nivel
    const newRoutine = this.routineRepository.create({
      url_routine: createRoutineDto.url_routine,
      user,   // Asociamos el usuario
      level,  // Asociamos el nivel
    });

    // Guardamos la nueva rutina en la base de datos
    return this.routineRepository.save(newRoutine);
  }

  async findAll(): Promise<Routine[]> {
    return this.routineRepository.find({ relations: ['user', 'level'] });
  }

  async findOne(id: string): Promise<Routine> {
    const routine = await this.routineRepository.findOne({
      where: { id_routine: id },
      relations: ['user', 'level'],
    });
    if (!routine) {
      throw new NotFoundException(`Routine with ID ${id} not found`);
    }
    return routine;
  }

  async update(id: string, updateRoutineDto: any): Promise<Routine> {
    await this.findOne(id);
    await this.routineRepository.update(id, updateRoutineDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.routineRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Routine with ID ${id} not found`);
    }
  }
}
