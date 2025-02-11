import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
  Put,
} from '@nestjs/common';
import { RoutinesService } from './routines.service';
import { CreateRoutineDto } from '../dtos/create-routine.dto';
import { UpdateRoutineDto } from '../dtos/update-routine.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Roles } from 'src/auth/guards/roles.decorator';
import { Role } from 'src/auth/guards/roles.enum';

@ApiTags('routines: Gestión de rutinas')
@Controller('routines')
export class RoutinesController {
  constructor(private readonly routinesService: RoutinesService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Crea una rutina nueva (Usuarios registrados)',
    description:
      'Esta ruta está protegida, solo los usuarios registrados pueden acceder.',
  })
  @ApiResponse({ status: 201, description: 'Rutina creada correctamente.' })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Acceso prohibido.' })
  @UseGuards(AuthGuard)
  @Post('/associate')
  associateRoutine(@Body() createRoutineDto: CreateRoutineDto) {
    return this.routinesService.associateRoutine(createRoutineDto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtener el catálogo de todas las rutinas (Usuarios Registrados)',
    description:
      'Esta ruta está protegida, solo los usuarios autenticados pueden acceder.',
  })
  @ApiResponse({ status: 200, description: 'Retorna todas las rutinas.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Acceso prohibido.' })
  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.routinesService.findAll();
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtener una rutina por ID del Socio (Usuarios Registrados)',
    description:
      'Esta ruta está protegida, solo los usuarios autenticados pueden acceder.',
  })
  @ApiResponse({ status: 200, description: 'Retorna una rutina específica.' })
  @ApiResponse({ status: 404, description: 'Rutina no encontrada.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Acceso prohibido.' })
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.routinesService.findOne(id);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Actualizar una rutina (Admin y Coach)',
    description:
      'Esta ruta está protegida, solo los usuarios con rol de Admin o Coach pueden acceder.',
  })
  @ApiResponse({
    status: 200,
    description: 'Rutina actualizada correctamente.',
  })
  @ApiResponse({ status: 404, description: 'Rutina no encontrada.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Acceso prohibido.' })
  @UseGuards(AuthGuard, RolesGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateRoutineDto: UpdateRoutineDto) {
    return this.routinesService.update(id, updateRoutineDto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Eliminar una rutina (Admin y Coach)',
    description:
      'Esta ruta está protegida, solo los usuarios con rol de Admin o Coach pueden acceder.',
  })
  @ApiResponse({ status: 200, description: 'Rutina eliminada correctamente.' })
  @ApiResponse({ status: 404, description: 'Rutina no encontrada.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Acceso prohibido.' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Coach)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.routinesService.remove(id);
  }
}
