import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { CatalogoService } from './catalogo.service';
import { CreateCatalogoDto } from '../dtos/create-catalogo.dto';
import { UpdateCatalogoDto } from '../dtos/update-catalogo.dto';
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

@ApiTags('Catalogo: Catálogo de rutinas')
@Controller('catalogo')
export class CatalogoController {
  constructor(private readonly catalogoService: CatalogoService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtener el catálogo completo de rutinas',
    description:
      'Ruta protegida',
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna el catalogo completo de rutinas.',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado. Necesitas estar autenticado.',
  })
  @ApiResponse({ status: 403, description: 'Acceso prohibido.' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Coach, Role.User)
  @Get()
  findAll() {
    return this.catalogoService.findAll();
  }

  
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Obtener una rutina del catálogo por ID (Admin y Coach)', 
    description: 'Ruta protegida. Solo los usuarios con rol de Admin o Coach tienen acceso a esta operación.'
  })
  @ApiResponse({ status: 200, description: 'Retorna un rutina de entrenamiento del catalogo.' })
  @ApiResponse({ status: 404, description: 'Rutina de entrenamiento no encontrada.' })
  @ApiResponse({ status: 401, description: 'No autorizado. Necesitas estar autenticado.' })
  @ApiResponse({ status: 403, description: 'Acceso prohibido.' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Coach)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.catalogoService.findOne(id);
  }

  
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Crear una rutina de entrenamiento en el catálogo (Admin y Coach)', 
    description: 'Ruta protegida. Solo los usuarios con rol de Admin o Coach tienen acceso a esta operación.' 
  })
  @ApiResponse({ status: 201, description: 'Rutina creada en el catálogo correctamente.' })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta.' })
  @ApiResponse({ status: 401, description: 'No autorizado. Necesitas estar autenticado.' })
  @ApiResponse({ status: 403, description: 'Acceso prohibido. Solo Admin o Coach pueden acceder.' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Coach)
  @Post()
  create(@Body() createCatalogoDto: CreateCatalogoDto) {
    return this.catalogoService.create(createCatalogoDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Actualizar una rutina del catálogo (Admin y Coach)', 
    description: 'Ruta protegida. Solo los usuarios con rol de Admin o Coach tienen acceso a esta operación.' 
  })
  @ApiResponse({ status: 200, description: 'Rutina de entrenamiento actualizada correctamente.' })
  @ApiResponse({ status: 404, description: 'Rutina de entrenamiento no encontrada.' })
  @ApiResponse({ status: 401, description: 'No autorizado. Necesitas estar autenticado.' })
  @ApiResponse({ status: 403, description: 'Acceso prohibido. Solo Admin o Coach pueden acceder.' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Coach)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCatalogoDto: UpdateCatalogoDto,
  ) {
    return this.catalogoService.update(id, updateCatalogoDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Eliminar una rutina del catálogo (Admin y Coach)', 
    description: 'Ruta protegida. Solo los usuarios con rol de Admin o Coach tienen acceso a esta operación.' 
  })
  @ApiResponse({ status: 200, description: 'Rutina de entrenamiento eliminada del catálogo correctamente.' })
  @ApiResponse({ status: 404, description: 'Rutina de entrenamiento no encontrada en el catálogo.' })
  @ApiResponse({ status: 401, description: 'No autorizado. Necesitas estar autenticado.' })
  @ApiResponse({ status: 403, description: 'Acceso prohibido. Solo Admin o Coach pueden acceder.' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Coach)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.catalogoService.remove(id);
  }
}
