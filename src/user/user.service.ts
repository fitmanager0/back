import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UpdatePersonalInfoDto } from 'src/dtos/update-personal-info.dto';
import { UpdateAdminFieldsDto } from 'src/dtos/update-admin-fields.dto';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,  
  ) {}

  async findAll() {
    return this.userRepository.find();
  }
  
  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id_user: id }
    })

    if(!user) {
      throw new NotFoundException(`El usuario con el ID: ${id}, no existe.`)
    }

    return user;
  }


  async findProfileById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id_user: id },
    });

    if (!user) {
      throw new NotFoundException(`El usuario con el ID: ${id} no existe.`);
    }

    return {
      id: user.id_user,
      name: user.name,
      email: user.email,
      birthdate: user.birthdate,
      phone: user.phone,
      address: user.address,
      city: user.city,
      country: user.country,
      entry_date: user.entry_date
    };
  }


  async updatePersonalInfo(
    id: string,
    updatePersonalInfoDto: UpdatePersonalInfoDto,
    modifier: { userId: string; email: string },
  ) {
    const user = await this.userRepository.findOne({ where: { id_user: id } });
    if (!user) {
      throw new NotFoundException(`El usuario con ID: ${id} no existe.`);
    }
  
    const updatedFields = Object.keys(updatePersonalInfoDto).filter(
      (key) => updatePersonalInfoDto[key] !== undefined && key !== 'confirmPassword',
    );
    if (updatedFields.length === 0) {
      return {
        id,
        message: `No se realizaron cambios en la información personal.`,
      };
    }
    
    if (updatePersonalInfoDto.password && updatePersonalInfoDto.confirmPassword){
      if(updatePersonalInfoDto.password !== updatePersonalInfoDto.confirmPassword) {
        throw new BadRequestException('Las contraseñas no coinciden.');
      }

      const salt = await bcrypt.genSalt(10);
      updatePersonalInfoDto.password = await bcrypt.hash(updatePersonalInfoDto.password, salt);
    }

    const updatedUser = this.userRepository.create({ ...user, ...updatePersonalInfoDto });
    await this.userRepository.save(updatedUser);

    const formattedFields = updatedFields.map((field) => `'${field}'`).join(', ');
  
    return {
      id,
      message: `Información personal del usuario actualizada con éxito. Campos modificados: ${formattedFields}`,
    };
  }

  
  async updateAdminFields(
    id: string,
    updateAdminFieldsDto: UpdateAdminFieldsDto,
    modifier: { adminId: string; email: string },
  ) {
    const user = await this.userRepository.findOne({ where: { id_user: id } });
    if (!user) {
        throw new NotFoundException(`El usuario con ID: ${id} no existe.`);
    }

    // Filtrar campos que no sean undefined
    const updatedFields = Object.keys(updateAdminFieldsDto).filter(
        (key) => updateAdminFieldsDto[key] !== undefined,
    );

    if (updatedFields.length === 0) {
        return {
            id,
            message: `No se realizaron cambios administrativos.`,
        };
    }

    // Actualizar campos
    const updatedUser = this.userRepository.create({ ...user, ...updateAdminFieldsDto });
    await this.userRepository.save(updatedUser);

    const formattedFields = updatedFields.map((field) => `'${field}'`).join(', ');

    return {
        id,
        message: `Datos administrativos del usuario actualizados con éxito. Campos modificados: ${formattedFields}`,
    };
  }


  async remove(id: string) {
    const user = await this.userRepository.findOne({
      where: { id_user: id },
    });

    if (!user) {
      throw new NotFoundException(`El usuario con ID: ${id} no existe.`);
    }

    await this.userRepository.remove(user);
  
    return { 
      message: `El usuario con ID: ${id}, fue eliminado con éxito.` 
    };
  }
}
