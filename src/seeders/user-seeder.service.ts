import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../entities/roles.entity';
import { HealthSheet } from '../entities/helthsheet.entity';
import * as data from './data'; // Importar el archivo de datos

@Injectable()
export class UserSeederService implements OnModuleInit {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(HealthSheet)
    private readonly healthSheetRepository: Repository<HealthSheet>,
  ) {}

  async seedRoles() {
    for (const roleData of data.roles) {
      const existingRole = await this.roleRepository.findOne({
        where: { id_role: roleData.id_role },
      });

      if (!existingRole) {
        const role = this.roleRepository.create(roleData);
        await this.roleRepository.save(role);
        console.log(`Rol ${role.description} creado.`);
      }
    }
  }

  async seedUsers() {
    for (const userData of data.users) {
      const existingUser = await this.userRepository.findOne({
        where: { email: userData.email },
      });

      if (!existingUser) {
        // Buscar el rol del usuario
        const role = await this.roleRepository.findOne({
          where: { id_role: userData.id_rol },
        });

        if (!role) {
          console.error(
            `El rol con id ${userData.id_rol} no existe. Asegúrate de que los roles estén correctamente precargados.`,
          );
          continue;
        }



        // Crear el usuario con isActive del archivo de datos
        const user = this.userRepository.create({
          ...userData,
          role // Asociar el rol encontrado

        });

        await this.userRepository.save(user);
        console.log(`Usuario ${user.name} creado. Activo: ${user.isActive}`);
      }
    }
  }

  async seed() {
    console.log('Iniciando la precarga de datos...');
    await this.seedRoles();
    await this.seedUsers();
    console.log('Precarga de datos completada.');
  }

  async onModuleInit() {
    await this.seed();
  }
}
