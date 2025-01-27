import {
    Body,
    Controller,
    Get,
    Post,
    Put,
    Param,
    Delete,
    UseGuards,
  } from '@nestjs/common';
  import { HealthsheetService } from './healthsheet.service';
  import { CreateHealthsheetDto } from '../dtos/create-healthsheet.dto';
  import { UpdateHealthsheetDto } from '../dtos/update-healthsheet.dto';
  import { Roles } from 'src/auth/guards/roles.decorator';
  import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
  import { AuthGuard } from 'src/auth/guards/auth.guard';
  import { RolesGuard } from 'src/auth/guards/roles.guards';
  import { Role } from 'src/auth/guards/roles.enum';

  
  @ApiTags('HealthSheet: Gestión de Fichas Médicas')
  @Controller('healthsheet')
  export class HealthsheetController {
    constructor(private readonly healthsheetService: HealthsheetService) {}
  
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtener todas las fichas médicas (Admin)' })
    @ApiResponse({ status: 200, description: 'Retorna todas las fichas médicas.' })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Get()
    findAll() {
      return this.healthsheetService.findAll();
    }
  
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtener una ficha médica por ID' })
    @ApiResponse({ status: 200, description: 'Retorna una ficha médica específica.' })
    @ApiResponse({ status: 404, description: 'Ficha no encontrada.' })
    @UseGuards(AuthGuard)
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.healthsheetService.findOne(id);
    }
  
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Buscar ficha médica por ID de usuario' })
    @ApiResponse({ status: 200, description: 'Retorna una ficha médica específica asociada a un usuario.' })
    @ApiResponse({ status: 404, description: 'Ficha no encontrada para el usuario indicado.' })
    @UseGuards(AuthGuard)
    @Get('user/:id_user')
    findByUserId(@Param('id_user') id_user: string) {
      return this.healthsheetService.findByUserId(id_user);
    }
  
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Crear una nueva ficha médica' })
    @ApiResponse({ status: 201, description: 'Ficha médica creada exitosamente.' })
    @ApiResponse({ status: 400, description: 'Solicitud incorrecta.' })
    @UseGuards(AuthGuard)
    @Post()
    create(@Body() createHealthsheetDto: CreateHealthsheetDto) {
      return this.healthsheetService.create(createHealthsheetDto);
    }
  
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Actualizar una ficha médica' })
    @ApiResponse({ status: 200, description: 'Ficha médica actualizada exitosamente.' })
    @ApiResponse({ status: 404, description: 'Ficha no encontrada.' })
    @UseGuards(AuthGuard)
    @Put(':id')
    update(@Param('id') id: string, @Body() updateHealthsheetDto: UpdateHealthsheetDto) {
      return this.healthsheetService.update(id, updateHealthsheetDto);
    }
  
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Eliminar una ficha médica' })
    @ApiResponse({ status: 200, description: 'Ficha médica eliminada exitosamente.' })
    @ApiResponse({ status: 404, description: 'Ficha no encontrada.' })
    @UseGuards(AuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.healthsheetService.remove(id);
    }
  }