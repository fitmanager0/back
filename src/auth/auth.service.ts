import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { HealthSheet } from 'src/entities/helthsheet.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(HealthSheet)
    private healthSheetRepository: Repository<HealthSheet>,

    private jwtService: JwtService,
  ) {}

  async signup(user: CreateUserDto) {
    // Verificar si el email ya está registrado
    const userExist = await this.usersRepository.findOneBy({
      email: user.email,
    });
    if (userExist) {
      throw new BadRequestException('El email ya está registrado.');
    }

    // Validar la existencia de otros campos obligatorios
    if (!user.password) {
      throw new BadRequestException('El campo password es obligatorio.');
    }

    // Validar la confirmación de contraseña
    if (user.password !== user.confirmPassword) {
      throw new BadRequestException('Las contraseñas no coinciden.');
    }

    // Validar si el rol existe o es permitido
    if (!user.id_rol || ![1, 2, 3].includes(user.id_rol)) {
      throw new BadRequestException(
        'El id_rol debe ser uno de los siguientes valores: 1, 2 o 3.',
      );
    }

    // Crear HealthSheet si no se proporciona uno
    let healthSheet;
    if (!user.healthSheetId) {
      healthSheet = this.healthSheetRepository.create({
        urlSheet: 'https://res.cloudinary.com/dj0v6zokk', // URL de ejemplo
      });
      healthSheet = await this.healthSheetRepository.save(healthSheet);
    } else {
      // Buscar HealthSheet usando el campo 'id_sheet'
      healthSheet = await this.healthSheetRepository.findOne({
        where: { id_sheet: user.healthSheetId }, // Usamos 'id_sheet' como la clave primaria
      });

      if (!healthSheet) {
        throw new BadRequestException(
          'El HealthSheet proporcionado no existe.',
        );
      }
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(user.password, 10);

    // Crear nuevo usuario
    const { confirmPassword, healthSheetId, ...userData } = user; // Excluir confirmPassword y healthSheetId
    const newUser: Partial<User> = {
      ...userData,
      password: hashedPassword,
      entry_date: new Date(),
      isActive: user.isActive ?? true,
      healthSheet: healthSheet, // Asociar el HealthSheet
    };

    // Guardar usuario en la base de datos
    const savedUser = await this.usersRepository.save(newUser);

    // Excluir la contraseña del usuario devuelto
    const { password, ...userWithoutSensitiveData } = savedUser;
    return userWithoutSensitiveData;
  }

  async signin(email: string, password: string) {
    // Buscar usuario por email
    const user = await this.usersRepository.findOneBy({ email });

    if (!user) {
      throw new NotFoundException('Credenciales inválidas');
    }

    // Validar la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Generar el token JWT
    const payload = {
      id: user.id_user,
      email: user.email,
      rol: user.id_rol,
    };
    const token = this.jwtService.sign(payload);

    return { mensaje: 'Logged in', token };
  }
}
