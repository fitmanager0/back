import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Level } from '../entities/level.entity';
import { CreateLevelDto } from '../dtos/create-level.dto';
import { UpdateLevelDto } from '../dtos/update-level.dto';

@Injectable()
export class LevelsService {
  constructor(
    @InjectRepository(Level)
    private readonly levelRepository: Repository<Level>,
  ) {}

  async create(createLevelDto: CreateLevelDto): Promise<Level> {
    const newLevel = this.levelRepository.create(createLevelDto);
    return this.levelRepository.save(newLevel);
  }

  async findAll(): Promise<Level[]> {
    return this.levelRepository.find({ relations: ['routines'] });
  }

  async findOne(id: string): Promise<Level> {
    const level = await this.levelRepository.findOne({
      where: { id_level: id },
      relations: ['routines'],
    });
    if (!level) {
      throw new NotFoundException(`Level with ID ${id} not found`);
    }
    return level;
  }

  async update(id: string, updateLevelDto: UpdateLevelDto): Promise<Level> {
    await this.findOne(id);
    await this.levelRepository.update(id, updateLevelDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.levelRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Level with ID ${id} not found`);
    }
  }
}
