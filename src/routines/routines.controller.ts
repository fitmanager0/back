import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { RoutinesService } from './routines.service';
import { CreateRoutineDto } from '../dtos/create-routine.dto';
import { UpdateRoutineDto } from '../dtos/update-routine.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('routines')
@Controller('routines')
export class RoutinesController {
  constructor(private readonly routinesService: RoutinesService) {}

  // Ruta para asociar una rutina sin autenticación JWT
  @Post('/associate')
  associateRoutine(@Body() createRoutineDto: CreateRoutineDto) {
    return this.routinesService.associateRoutine(createRoutineDto);
  }

  // Ruta para obtener todas las rutinas
  @Get()
  findAll() {
    return this.routinesService.findAll();
  }

  // Ruta para obtener una rutina por ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.routinesService.findOne(id);
  }

  // Ruta para actualizar una rutina por ID
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoutineDto: UpdateRoutineDto) {
    return this.routinesService.update(id, updateRoutineDto);
  }

  // Ruta para eliminar una rutina por ID
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.routinesService.remove(id);
  }
}
