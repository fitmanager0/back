import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Level } from '../entities/level.entity';
import { CreateLevelDto } from '../dtos/create-level.dto';
import { UpdateLevelDto } from '../dtos/update-level.dto';
import { Routine } from '../entities/routine.entity';

@Injectable()
export class LevelsService {
  constructor(
    @InjectRepository(Level)
    private readonly levelRepository: Repository<Level>,
    @InjectRepository(Routine)
    private readonly routineRepository: Repository<Routine>,
  ) {}

  async create(createLevelDto: CreateLevelDto): Promise<Level> {
    const newLevel = this.levelRepository.create(createLevelDto);
    return this.levelRepository.save(newLevel);
  }

  async findAll(): Promise<Level[]> {
    return this.levelRepository.find({ relations: ['routines'] });
  }

  async findOne(id: number): Promise<Level> {
    const level = await this.levelRepository.findOne({
      where: { id_level: id },
      relations: ['routines'],
    });
    if (!level) {
      throw new NotFoundException(`Level with ID ${id} not found`);
    }
    return level;
  }

  async update(id: number, updateLevelDto: UpdateLevelDto): Promise<Level> {
    // Busca la entidad completa, incluyendo la relación "routines"
    const level = await this.levelRepository.findOne({
      where: { id_level: id },
      relations: ['routines'],
    });

    if (!level) {
      throw new NotFoundException(
        `Nivel de entrenamiento con id ${id} no encontrado`,
      );
    }

    // Actualiza la propiedad "description" si se envía en el DTO
    if (updateLevelDto.description !== undefined) {
      level.description = updateLevelDto.description;
    }

    // Si se envía la propiedad "routines", se actualiza la relación.
    if ((updateLevelDto as any).routines !== undefined) {
      const routineIds = (updateLevelDto as any).routines as string[]; // Cambié a `string[]` ya que `id_routine` es un UUID
      // Busca las rutinas que correspondan a los IDs enviados usando el operador In
      const routines = await this.routineRepository.find({
        where: { id_routine: In(routineIds) },
      });
      if (routineIds.length > 0 && routines.length !== routineIds.length) {
        throw new NotFoundException(
          'Una o más rutinas proporcionadas no existen.',
        );
      }
      level.routines = routines;
    }

    // Guarda y retorna el nivel actualizado
    return this.levelRepository.save(level);
  }

  async remove(id: string): Promise<void> {
    const result = await this.levelRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Level with ID ${id} not found`);
    }
  }
}
