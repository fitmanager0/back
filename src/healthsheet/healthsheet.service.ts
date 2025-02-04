import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HealthSheet } from '../entities/helthsheet.entity';
import { CreateHealthsheetDto } from '../dtos/create-healthsheet.dto';
import { UpdateHealthsheetDto } from '../dtos/update-healthsheet.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class HealthsheetService {
  constructor(
    @InjectRepository(HealthSheet)
    private readonly healthsheetRepository: Repository<HealthSheet>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findAll() {
    return this.healthsheetRepository.find({ relations: ['user'] });
  }

  async findOne(id: string) {
    const healthsheet = await this.healthsheetRepository.findOne({ where: { id_sheet: id }, relations: ['user'] });
    if (!healthsheet) {
      throw new NotFoundException('Ficha médica no encontrada');
    }
    return healthsheet;
  }

  async findByUserId(id_user: string) {
    const user = await this.userRepository.findOne({ where: { id_user }, relations: ['healthSheet'] });
    if (!user || !user.healthSheet) {
      throw new NotFoundException('Ficha médica no encontrada para el usuario indicado');
    }
    return user.healthSheet;
  }

  async create(createHealthsheetDto: CreateHealthsheetDto) {
    const { id_user, ...data } = createHealthsheetDto;
    const user = await this.userRepository.findOne({ where: { id_user } });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const healthsheet = this.healthsheetRepository.create({ ...data, user });
    return this.healthsheetRepository.save(healthsheet);
  }

  async update(id: string, updateHealthsheetDto: UpdateHealthsheetDto) {
    const healthsheet = await this.healthsheetRepository.preload({ id_sheet: id, ...updateHealthsheetDto });

    if (!healthsheet) {
      throw new NotFoundException('Ficha médica no encontrada');
    }

    return this.healthsheetRepository.save(healthsheet);
  }

  async remove(id: string) {
    const healthsheet = await this.healthsheetRepository.findOne({ where: { id_sheet: id } });

    if (!healthsheet) {
      throw new NotFoundException('Ficha médica no encontrada');
    }

    return this.healthsheetRepository.remove(healthsheet);
  }
}