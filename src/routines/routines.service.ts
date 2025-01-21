import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Routine } from '../entities/routine.entity';
import { CreateRoutineDto } from '../dtos/create-routine.dto';
import { UpdateRoutineDto } from '../dtos/update-routine.dto';

@Injectable()
export class RoutinesService {
  constructor(
    @InjectRepository(Routine)
    private readonly routineRepository: Repository<Routine>,
  ) {}

  async create(createRoutineDto: CreateRoutineDto): Promise<Routine> {
    const newRoutine = this.routineRepository.create(createRoutineDto);
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

  async update(id: string, updateRoutineDto: UpdateRoutineDto): Promise<Routine> {
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
