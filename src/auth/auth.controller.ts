import {
  Controller,
  Get,
  Post,
  Body,
  BadRequestException,
  NotFoundException,
  Res,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../dtos/LoginUserDto';
import { CreateUserDto } from '../dtos/CreateUserDto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from './guards/public.decorator';
import { User } from 'src/entities/user.entity';

@ApiTags('Auth: Registro e Inicio de Sesión') 
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/signup')
  @ApiOperation({ 
    summary: 'Registrar un nuevo usuario (Public)',
    description: 'Registro de nuevos usuarios, acceso puclico.'
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado correctamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o incompletos.',
  })
  @ApiBody({
    description: 'Datos necesarios para registrar un usuario',
    type: CreateUserDto,
  })
  async signUp(@Body() user: CreateUserDto) {
    return this.authService.signup(user);
  }

  @Public()
  @Post('/signin')
  @ApiOperation({ 
    summary: 'Iniciar sesión de usuarios (Public)',
    description: 'Inicio de seción de usuarios mediante autenticación ingresando correo electrónico y contraseña'
  })
  @ApiResponse({
    status: 200,
    description: 'Inicio de sesión exitoso, devuelve un token de acceso.',
  })
  @ApiResponse({
    status: 400,
    description: 'Credenciales inválidas o error desconocido.',
  })
  @ApiBody({
    description: 'Datos necesarios para iniciar sesión',
    type: LoginUserDto,
  })
  async signin(@Body() loginUserDto: LoginUserDto) {
    try {
      const { email, password } = loginUserDto;
      return await this.authService.signin(email, password);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException(
          'Credenciales inválidas. Verifique el correo electrónico y la contraseña.',
        );
      }

      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new BadRequestException(`Error al iniciar sesión. ${errorMessage}`);
    }
  }

  @Public()
  // @Post('auth0/callback')
  // async auth0Callback(@Req() req: Request, @Res() res: Response) {
  //   const { idToken } = req.body; // Recibe el idToken de Auth0
  //   const user = await this.authService.handleAuth0Login(idToken);

  //   // Redirigir al cliente con el token del sistema o enviar respuesta
  //   res.json(user);
  // }

  
  @Post('auth0/callback')
    async auth0Callback(@Body() body: { idToken: string }): Promise<{ user: User; token: string }> {
    const { idToken } = body;

    if (!idToken) {
      throw new Error('idToken is missing');
    }

    // Simulando obtener datos del usuario (ejemplo)
    const user = new User(); //'123', 'John Doe'
    const token = 'fake-jwt-token'; // Aquí deberías generar un token válido.

    return { user, token };
  }

  @Post('complete-registration')
    async completeRegistration(@Body() userDto: CreateUserDto) {
    return this.authService.signup(userDto); // Reutiliza el método de registro
  }

}
