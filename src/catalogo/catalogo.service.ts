import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Catalogo } from '../entities/catalogo.entity';
import { CreateCatalogoDto } from '../dtos/create-catalogo.dto';
import { UpdateCatalogoDto } from '../dtos/update-catalogo.dto';

@Injectable()
export class CatalogoService {
  constructor(
    @InjectRepository(Catalogo)
    private readonly catalogoRepository: Repository<Catalogo>,
  ) {}

  async findAll(): Promise<Catalogo[]> {
    return await this.catalogoRepository.find();
  }

  async findOne(id: string): Promise<Catalogo> {
    const catalogo = await this.catalogoRepository.findOne({ where: { id_cat: id } });
    if (!catalogo) {
      throw new NotFoundException(`Catálogo con ID ${id} no encontrado`);
    }
    return catalogo;
  }

  async create(createCatalogoDto: CreateCatalogoDto): Promise<Catalogo> {
    const catalogo = this.catalogoRepository.create(createCatalogoDto);
    return await this.catalogoRepository.save(catalogo);
  }

  async update(id: string, updateCatalogoDto: UpdateCatalogoDto): Promise<Catalogo> {
    await this.findOne(id);
    await this.catalogoRepository.update(id, updateCatalogoDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const catalogo = await this.findOne(id);
    await this.catalogoRepository.remove(catalogo);
  }
}
