import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

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

    return {
      id: user.id_user,
      name: user.name,
      email: user.email,
      rol: user.id_rol,
      birthdate: user.birthdate,
      phone: user.phone,
      address: user.address,
      city: user.city,
      country: user.country,
      active: user.isActive,
      entry_date: user.entry_date
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: { id_user: id }
    })

    if(!user) {
      throw new NotFoundException(`El usuario con el ID: ${id}, no existe.`)
    }

    const updatedFields = Object.keys(updateUserDto).filter(
      (key) => updateUserDto[key] !== undefined && key !== 'confirmPassword',
    );
    if (updatedFields.length === 0) {
      return { 
        id, 
        message: `El usuario con ID: ${id}, no realizó ningun cambio durante la actualización.`
      };
    }

    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt(10);
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    const updatedUser = this.userRepository.create({ ...user, ...updateUserDto });
    await this.userRepository.save(updatedUser);

    const formattedFields = updatedFields.map((field) => `'${field}'`).join(', ');
    return {
      id,
      message: `El usuario con el ID: ${id}, há actualizado los siguientes campos con éxito: ${formattedFields}.`,
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
