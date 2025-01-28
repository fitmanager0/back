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
import { ConfigService } from '@nestjs/config';

interface TokenResponse {
  id_token: string;
  access_token: string;
  expires_in: number;
  token_type: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(HealthSheet)
    private healthSheetRepository: Repository<HealthSheet>,

    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  getAuth0LoginUrl(): string {
    const domain = this.configService.get('AUTH0_DOMAIN');
    const clientId = this.configService.get('AUTH0_CLIENT_ID');
    const redirectUri = this.configService.get('AUTH0_CALLBACK_URL');
    return `https://${domain}/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=openid profile email`;
  }

  async handleAuth0Callback(query: any) {
    const domain = this.configService.get('AUTH0_DOMAIN');
    const clientId = this.configService.get('AUTH0_CLIENT_ID');
    const clientSecret = this.configService.get('AUTH0_CLIENT_SECRET');
    const redirectUri = this.configService.get('AUTH0_CALLBACK_URL');

    const tokenResponse = await axios.post<TokenResponse>(`https://${domain}/oauth/token`, {
      grant_type: 'authorization_code',
      client_id: clientId,
      client_secret: clientSecret,
      code: query.code,
      redirect_uri: redirectUri,
    });

    const { id_token } = tokenResponse.data;
    
    const userInfo = await this.getUserInfo(id_token);

    return this.findOrCreateUser(userInfo);
  }

  async getUserInfo(idToken: string) {
    const response = await axios.get(`https://${this.configService.get('AUTH0_DOMAIN')}/userinfo`, {
      headers: { Authorization: `Bearer ${idToken}` },
    });
    return response.data;
  }

  async findOrCreateUser(userInfo: any) {
    const existingUser = await this.usersRepository.findOneBy({
      email: userInfo.email,
    });

    if (existingUser) {
      return existingUser;
    }

    const newUser = this.usersRepository.create({
      name: userInfo.name,
      email: userInfo.email,
      authProvider: 'auth0',
      thirdPartyId: userInfo.sub,
      isProfileComplete: false,
      entry_date: new Date(),
      isActive: true,
    });

    return this.usersRepository.save(newUser);
  }

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
        where: { id_sheet: user.healthSheetId },
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
      id_rol: idRol,
      password: hashedPassword,
      entry_date: new Date(),
      isActive: user.isActive ?? true,
      healthSheet: healthSheet,
    };

    const savedUser = await this.usersRepository.save(newUser);

    const { password, ...userWithoutSensitiveData } = savedUser;
    return userWithoutSensitiveData;
  }

  async signin(email: string, password: string) {
    const user = await this.usersRepository.findOneBy({ email });

    if (!user) {
      throw new NotFoundException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = {
      id: user.id_user,
      email: user.email,
      rol: user.id_rol,
    };
    const token = this.jwtService.sign(payload);

    return { mensaje: 'Logged in', token, user };
  }
}
