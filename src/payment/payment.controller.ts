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
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from '../dtos/create-payment.dto';
import { UpdatePaymentDto } from '../dtos/update-payment.dto';
import { Roles } from 'src/auth/guards/roles.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Role } from 'src/auth/guards/roles.enum';

@ApiTags('Payments: Gestion de pagos')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtener todos los pagos registrados (Admin)',
    description:
      'Esta ruta está protegida, solo los usuarios con rol de Admin pueden acceder.',
  })
  @ApiResponse({ status: 200, description: 'Retorna todos los pagos.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Acceso prohibido.' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get()
  findAll() {
    return this.paymentService.findAll();
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtener un pago por ID (Admin)',
    description:
      'Esta ruta está protegida, solo los usuarios con rol de Admin pueden acceder.',
  })
  @ApiResponse({ status: 200, description: 'Retorna un pago específico.' })
  @ApiResponse({ status: 404, description: 'Pago no encontrado.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Acceso prohibido.' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(id);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Generar un nuevo pago (Admin)',
    description:
      'Esta ruta está protegida, solo los usuarios con rol de Admin pueden acceder.',
  })
  @ApiResponse({ status: 201, description: 'Pago creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Acceso prohibido.' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post()
  async create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.create(createPaymentDto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Actualizar detalles de un pago (Admin)',
    description:
      'Esta ruta está protegida, solo los usuarios con rol de Admin pueden acceder.',
  })
  @ApiResponse({ status: 200, description: 'Pago actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Pago no encontrado.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Acceso prohibido.' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Put(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentService.update(id, updatePaymentDto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Eliminar un pago (Admin)',
    description:
      'Esta ruta está protegida, solo los usuarios con rol de Admin pueden acceder.',
  })
  @ApiResponse({ status: 200, description: 'Pago eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Pago no encontrado.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Acceso prohibido.' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentService.remove(id);
  }
}
