import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { RoutinesService } from './routines.service';
import { CreateRoutineDto } from '../dtos/create-routine.dto';
import { UpdateRoutineDto } from '../dtos/update-routine.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('routines')
@Controller('routines')
export class RoutinesController {
  constructor(private readonly routinesService: RoutinesService) {}

  @Post()
  create(@Body() createRoutineDto: CreateRoutineDto) {
    return this.routinesService.create(createRoutineDto);
  }

  @Get()
  findAll() {
    return this.routinesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.routinesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoutineDto: UpdateRoutineDto) {
    return this.routinesService.update(id, updateRoutineDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.routinesService.remove(id);
  }
}
