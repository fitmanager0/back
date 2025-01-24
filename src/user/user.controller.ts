import { Controller, Get, Body, Param, Delete, ParseUUIDPipe, Put, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/auth/guards/roles.decorator';
import { Role } from 'src/auth/guards/roles.enum';
import { Request } from 'express';

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
    summary: 'Actualizar un usuario por ID (Admin)',
    description: 'Solo los usuarios con rol de Administrador tienen acceso a este endpoint.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID del usuario que se quiere actualizar',
    required: true,
  })
  @ApiBody({
    description: 'Datos para actualizar el usuario',
    type: UpdateUserDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario actualizado exitosamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos proporcionados.',
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
  @Put(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string, 
    @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
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