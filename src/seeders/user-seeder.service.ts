import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../entities/roles.entity';  // Asegúrate de tener un DTO o entidad de Role

@Injectable()
export class UserSeederService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>, // Referencia a la entidad de roles
  ) {}

  async seedUsers() {
    // Buscar el rol de "administrador" en la tabla rol
    const roleAdmin = await this.roleRepository.findOne({
      where: { description: 'administrador' }, // Usamos el valor 'administrador' de la columna description
    });

    if (!roleAdmin) {
      throw new Error('El rol "administrador" no existe');
    }

    // Crear usuario
    const user = this.userRepository.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'hashed-password',  // Recuerda cifrar la contraseña
      role: roleAdmin,  // Relación con el rol de administrador
      birthdate: null,
      phone: null,
      address: null,
      city: null,
      country: null,
      isActive: true,
      entry_date: new Date(),
    });

    await this.userRepository.save(user);
  }

  async onModuleInit() {
    await this.seedUsers();
  }
}
