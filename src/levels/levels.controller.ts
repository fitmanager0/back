import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { LevelsService } from './levels.service';
import { CreateLevelDto } from '../dtos/create-level.dto';
import { UpdateLevelDto } from '../dtos/update-level.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Role } from 'src/auth/guards/roles.enum';
import { Roles } from 'src/auth/guards/roles.decorator';

@ApiTags('Levels: Niveles de entrenamiento')
@Controller('levels')
export class LevelsController {
  constructor(private readonly levelsService: LevelsService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Crear un nivel de entrenamiento (Admin y Coach)',
    description:
      'Ruta protegida. Solo los usuarios con rol de Admin o Coach tienen acceso a esta operación.',
  })
  @ApiResponse({
    status: 201,
    description: 'Nivel de entrenamiento creado correctamente.',
  })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta.' })
  @ApiResponse({
    status: 401,
    description: 'No autorizado. Necesitas estar autenticado.',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso prohibido. Solo Admin o Coach pueden acceder.',
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Coach)
  @Post()
  create(@Body() createLevelDto: CreateLevelDto) {
    return this.levelsService.create(createLevelDto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtener todos los niveles de entrenamiento (Admin y Coach)',
    description:
      'Ruta protegida. Solo los usuarios con rol de Admin o Coach tienen acceso a esta operación.',
  })
  @ApiResponse({ status: 200, description: 'Retorna todos los niveles.' })
  @ApiResponse({
    status: 401,
    description: 'No autorizado. Necesitas estar autenticado.',
  })
  @ApiResponse({ status: 403, description: 'Acceso prohibido.' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Coach)
  @Get()
  findAll() {
    return this.levelsService.findAll();
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtener un nivel de entrenamiento por ID (Admin y Coach)',
    description:
      'Ruta protegida. Solo los usuarios con rol de Admin o Coach tienen acceso a esta operación.',
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna un nivel de entrenamiento específico.',
  })
  @ApiResponse({
    status: 404,
    description: 'Nivel de entrenamiento no encontrado.',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado. Necesitas estar autenticado.',
  })
  @ApiResponse({ status: 403, description: 'Acceso prohibido.' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Coach)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.levelsService.findOne(id);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Actualizar un nivel de entrenamiento (Admin y Coach)',
    description:
      'Ruta protegida. Solo los usuarios con rol de Admin o Coach tienen acceso a esta operación.',
  })
  @ApiResponse({
    status: 200,
    description: 'Nivel de entrenamiento actualizado correctamente.',
  })
  @ApiResponse({
    status: 404,
    description: 'Nivelde entrenamiento no encontrado.',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado. Necesitas estar autenticado.',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso prohibido. Solo Admin o Coach pueden acceder.',
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Coach)
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateLevelDto: UpdateLevelDto) {
    return this.levelsService.update(id, updateLevelDto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Eliminar un nivel de entrenamiento (Admin y Coach)',
    description:
      'Ruta protegida. Solo los usuarios con rol de Admin o Coach tienen acceso a esta operación.',
  })
  @ApiResponse({
    status: 200,
    description: 'Nivel de entrenamiento eliminado correctamente.',
  })
  @ApiResponse({
    status: 404,
    description: 'Nivel de entrenamiento no encontrado.',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado. Necesitas estar autenticado.',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso prohibido. Solo Admin o Coach pueden acceder.',
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Coach)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.levelsService.remove(id);
  }
}
