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
import { CreateUserDto } from '../dtos/CreateUserDto';
import { HealthSheet } from '../entities/helthsheet.entity';
import axios from 'axios';

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

    // Asignar id_rol por defecto a 3 si no se proporciona
    const idRol = user.id_rol ?? 3; // Valor predeterminado es 3
    if (![1, 2, 3].includes(idRol)) {
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
    const { confirmPassword, healthSheetId, id_rol, ...userData } = user; // Excluir confirmPassword, healthSheetId, y id_rol
    const newUser: Partial<User> = {
      ...userData,
      id_rol: idRol, // Aquí usamos el valor predeterminado
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

    return { mensaje: 'Logged in', token, user };
  }

  async handleAuth0Login(idToken: string) {
    // 1. Validar token con Auth0
    const auth0Domain = process.env.AUTH0_DOMAIN;
    const auth0ClientId = process.env.AUTH0_CLIENT_ID;

    try {
      const response = await axios.get(`https://${auth0Domain}/userinfo`, {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      const { email, name } = response.data;

      // 2. Verificar si el usuario existe en tu base de datos
      let user = await this.usersRepository.findOne({ where: { email } });
      if (!user) {
        // 3. Si no existe, crea uno nuevo (requiere datos adicionales)
        throw new BadRequestException(
          'Faltan datos adicionales para completar el registro.',
        );
      }

      // 4. Generar token JWT para el sistema
      const payload = { id: user.id_user, email: user.email, rol: user.id_rol };
      const token = this.jwtService.sign(payload);

      return { user, token };
    } catch (error) {
      throw new BadRequestException('Error al validar el token de Auth0.');
    }
  }


}
