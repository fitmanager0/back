import { Controller, Get, Body, Param, Delete, ParseUUIDPipe, Put, UseGuards, Req, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/auth/guards/roles.decorator';
import { Role } from 'src/auth/guards/roles.enum';
import { Request } from 'express';
import { UpdatePersonalInfoDto } from 'src/dtos/update-personal-info.dto';
import { UpdateAdminFieldsDto } from 'src/dtos/update-admin-fields.dto';

declare module 'express' {
  interface Request {
    user?: { id: string; email: string }; // Define aquí las propiedades que esperas en `user`
  }
}

@ApiTags('Users: Gestión de usuarios')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Obtener datos de todos los usuarios (Admin y Coach)',
    description: 'Solo los usuarios con rol de Administrador tienen acceso a este endpoint.'
  })
  @ApiResponse({
    status: 200,
    description: 'Usuarios encontrados exitosamente.',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado. Solo Administradores pueden acceder.',
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Coach)
  @Get()
  findAll() {
    return this.userService.findAll();
  }


  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Obtener datos de usuario por ID (Admin y Coach)',
    description: 'Los roles permitidos para acceder a este endpoint son: **Administrador** y **Entrenador**.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID del usuario que se quiere obtener',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario encontrado exitosamente.',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado. Solo Administradores y Entrenadores pueden acceder.',
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontró el usuario con el ID especificado.',
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Coach)
  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.userService.findOne(id);
  }


  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtener informacion de mi perfil.',
    description:
      'Este endpoint permite que cualquier usuario autenticado vea únicamente su propio perfil.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID del usuario (propio) que se quiere obtener',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil del usuario encontrado exitosamente.',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado. Solo puedes acceder a tu propio perfil.',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado.',
  })
  @UseGuards(AuthGuard)
  @Get('profile/:id')
  async getProfile(@Param('id', new ParseUUIDPipe()) id: string, @Req() request: any) {
    const userId = request.user.id; // ID del usuario autenticado

    if (id !== userId) {
      throw new ForbiddenException('Acceso denegado. Solo puedes acceder a tu propio perfil.');
    }

    return this.userService.findProfileById(id);
  }


  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Actualizar información personal (Usuarios Registrados)',
    description: 'Permite a los usuarios registrados actualicen su información personal.',
  })
  @ApiBody({
    description: 'Datos personales a actualizar',
    type: UpdatePersonalInfoDto,
  })
  @ApiParam({
    name: 'id',
    description: 'ID del usuario que desea actualizar',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Información personal actualizada con éxito.',
    schema: {
        example: {
            id: '550e8400-e29b-41d4-a716-446655440000',
            message: 'Información personal actualizada con éxito.',
        },
    },
  })
  @ApiResponse({
      status: 401,
      description: 'No autorizado. El usuario no está autenticado.',
  })
  @ApiResponse({
      status: 403,
      description: 'Prohibido. No tienes permiso para actualizar estos datos.',
  })
  @ApiResponse({
      status: 404,
      description: 'No se encontró el usuario con el ID proporcionado.',
  })
  @UseGuards(AuthGuard)
  @Put('update-personal/:id')
  async updatePersonalInfo(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePersonalInfoDto: UpdatePersonalInfoDto,
    @Req() req: Request,
  ) {
    if (!req.user) {
      throw new UnauthorizedException('El usuario no está autenticado.');
    }

    const { id: userId, email } = req.user;

    if (id !== userId) {
      throw new ForbiddenException('No tienes permiso para actualizar estos datos.');
    }

    return this.userService.updatePersonalInfo(id, updatePersonalInfoDto, { userId, email });
  }


  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Actualizar campos administrativos (Admin)',
    description: 'Permite actualizar roles y estados de usuarios. Solo los administradores pueden acceder a este endpoint.',
  })
  @ApiBody({
    description: 'Datos administrativos a actualizar',
    type: UpdateAdminFieldsDto,
  })
  @ApiParam({
    name: 'id',
    description: 'ID del usuario cuyos campos administrativos se desean actualizar',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
      status: 200,
      description: 'Campos administrativos actualizados con éxito.',
      schema: {
        example: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          message: 'Datos administrativos del usuario actualizados con éxito. Campos modificados: id_rol, isActive',
        },
      },
  })
  @ApiResponse({
      status: 403,
      description: 'Prohibido. No puedes modificar tus propios campos administrativos.',
  })
  @ApiResponse({
      status: 404,
      description: 'No se encontró el usuario con el ID proporcionado.',
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Put('update-admin/:id')
  async updateAdminFields(
    @Param('id') id: string,
    @Body() updateAdminFieldsDto: UpdateAdminFieldsDto,
    @Req() req: Request,
  ) {
    const user = req.user as { id: string; email: string }
    const { id: adminId, email } = user;

    if (id === adminId) {
      throw new ForbiddenException('No puedes modificar tus propios campos administrativos.');
    }

    return this.userService.updateAdminFields(id, updateAdminFieldsDto, { adminId, email });
  }

  
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Eliminar un usuario por ID (Admin)',
    description: 'Solo los usuarios con rol de Administrador tienen acceso a este endpoint.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID del usuario que se quiere eliminar',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario eliminado exitosamente.',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado. Solo Administradores pueden acceder.',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado.',
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.userService.remove(id);
  }
}