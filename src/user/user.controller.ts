// user.controller.ts
import { Controller, Get, Body, Param, Delete, ParseUUIDPipe, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/guards/roles.decorator';

import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Role } from 'src/auth/guards/roles.enum';
import { AuthGuard } from 'src/auth/guards/auth.guards';
import { User } from 'src/entities/user.entity';

@ApiTags('users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //@ApiBearerAuth()
  //@UseGuards(RolesGuard)
  //@Roles(Role.Admin, Role.Coach)
  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({
    status: 200,
    description: 'Usuarios encontrados exitosamente.',
  })
  findAll() {
    return this.userService.findAll();
  }

  //@ApiBearerAuth()
  @Get(':id')
  //@UseGuards(AuthGuard, RolesGuard)
  //@Roles(Role.Admin, Role.Coach)
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
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
    status: 404,
    description: 'No se encontró el usuario con el ID especificado.',
  })
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.userService.findOne(id);
  }

  @ApiBearerAuth()
  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Actualizar un usuario por ID' })
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
    status: 404,
    description: 'Usuario no encontrado.',
  })
  update(
    @Param('id', new ParseUUIDPipe()) id: string, 
    @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Eliminar un usuario por ID' })
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
    status: 404,
    description: 'Usuario no encontrado.',
  })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.userService.remove(id);
  }

  //@ApiBearerAuth()
    //@UseGuards(AuthGuard, RolesGuard)
  //@Roles(Role.Admin, Role.Coach)
 
  @Get('email/:email')
  @ApiOperation({ summary: 'Obtener un usuario por su correo electrónico' })
  @ApiResponse({
    status: 200,
    description: 'Usuario encontrado',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontró un usuario con ese correo electrónico',
  })
  async findByEmail(@Param('email') email: string): Promise<User> {
    return this.userService.findByEmail(email);
  }

}