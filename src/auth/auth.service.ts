import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from  '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial } from 'typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>,
  private jwtService: JwtService ) {}



  async signup(user: Partial<User>) {
    // Validar si el email ya está registrado
    const userExist = await this.usersRepository.findOneBy({ email: user.email });
    if (userExist) {
      throw new BadRequestException('Usuario ya registrado');
    }
  
    // Validar la existencia del campo password
    if (!user.password) {
      throw new BadRequestException('El campo password es obligatorio');
    }
  
    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(user.password, 10);
  
    // Crear el nuevo usuario con la contraseña encriptada
    const newUser: DeepPartial<User> = { ...user, password: hashedPassword };
    const saveUser = await this.usersRepository.save(newUser);
  
    // Excluir la contraseña del usuario devuelto
    const { password, ...userWithoutSensitiveData } = saveUser as User;
    return userWithoutSensitiveData;
  }


  async signin(email: string, password: string) {
    const user = await this.usersRepository.findOneBy({ email });

    if (!user) {
      throw new NotFoundException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new NotFoundException('Credenciales inválidas');
    }

    const payload = {
      id: user.id_user,
      email: user.email,
      rol: user.id_rol,
    };
    const token = this.jwtService.sign(payload);
    return { mensaje: 'Logged in', token };
  }
}
