import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../entities/roles.entity';
import { HealthSheet } from '../entities/helthsheet.entity'; // Importar HealthSheet

@Injectable()
export class UserSeederService implements OnModuleInit {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(HealthSheet)
    private readonly healthSheetRepository: Repository<HealthSheet>, // Inyectar HealthSheetRepository
  ) {}

  async seed() {
    const adminEmail = 'admin@example.com'; // Email hardcodeado
    const existingAdmin = await this.userRepository.findOne({
      where: { email: adminEmail },
    });

    if (existingAdmin) {
      console.log(
        'El usuario administrador ya existe. No se realizará la precarga.',
      );
      return;
    }

    let adminRole = await this.roleRepository.findOne({
      where: { description: 'administrador' },
    });

    // Crear el rol de administrador si no existe
    if (!adminRole) {
      console.log('No se encontró el rol de administrador. Creando...');
      adminRole = this.roleRepository.create({
        description: 'administrador',
      });
      adminRole = await this.roleRepository.save(adminRole);
      console.log('Rol de administrador creado exitosamente.');
    }

    // Crear un HealthSheet para el administrador
    const healthSheet = this.healthSheetRepository.create({
      urlSheet: 'https://res.cloudinary.com/dj0v6zokk', // URL de ejemplo
    });
    await this.healthSheetRepository.save(healthSheet); // Guardar el HealthSheet

    const adminUser = this.userRepository.create({
      name: 'Admin User',
      email: adminEmail,
      password: '$2b$10$7W1kG8dL7cZRt44F6A7Xg.OFQm95klB4D/Xufly2lTy.3Al46CTeG', // Contraseña: admin123
      id_rol: adminRole.id_role,
      birthdate: new Date('1990-01-01'),
      phone: 123456789,
      address: '123 Admin Street',
      city: 'Admin City',
      country: 'Admin Country',
      isActive: true,
      entry_date: new Date(),
      healthSheet: healthSheet, // Asociar el HealthSheet creado
    });

    // Guardar usuario
    await this.userRepository.save(adminUser);
    console.log('Usuario administrador creado exitosamente.');
  }

  async onModuleInit() {
    await this.seed();
  }
}
