import { Controller, Get, Body, Param, Delete, ParseUUIDPipe, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({
    status: 200,
    description: 'Usuarios encontrados exitosamente.',
  })
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
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

  @Put(':id')
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

  @Delete(':id')
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
}