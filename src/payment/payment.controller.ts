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
import { MercadoPagoService } from './Mp/mercadoPago';
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

@ApiTags('Payments: Gestión de pagos')
@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly mercadoPagoService: MercadoPagoService,
  ) {}

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
    console.log('Consultando todos los pagos');
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
    console.log(`Consultando el pago con ID: ${id}`);
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
    console.log('Creando un nuevo pago:', createPaymentDto);
    return this.paymentService.create(createPaymentDto);
  }

  @ApiOperation({
    summary: 'Crear una preferencia de pago con MercadoPago',
    description: 'Genera una preferencia de pago para un producto o servicio.',
  })
  @ApiResponse({ status: 201, description: 'Preferencia creada exitosamente.' })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta.' })
  @Post('create-preference')
  async createPreference(
    @Body() body: { turno: { service: string; price: number } },
  ) {
    const { turno } = body;
    console.log('Datos recibidos para crear la preferencia:', turno);

    try {
      const result = await this.mercadoPagoService.createPreference({
        title: turno.service,
        price: turno.price,
      });
      console.log('Preferencia creada:', result);
      return result;
    } catch (error) {
      console.error('Error al crear preferencia:', error.message);
      throw error;
    }
  }

  @ApiOperation({
    summary: 'Procesar notificaciones de MercadoPago',
    description: 'Maneja las notificaciones enviadas por MercadoPago.',
  })
  @ApiResponse({
    status: 200,
    description: 'Notificación procesada exitosamente.',
  })
  @Post('notify')
  async handleNotification(@Body() query: any) {
    console.log('Notificación recibida:', query);

    try {
      const result = await this.mercadoPagoService.handleNotification(query);
      console.log('Resultado del manejo de notificación:', result);
      return result;
    } catch (error) {
      console.error('Error al manejar notificación:', error.message);
      throw error;
    }
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
    console.log(`Actualizando el pago con ID: ${id}`, updatePaymentDto);
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
    console.log(`Eliminando el pago con ID: ${id}`);
    return this.paymentService.remove(id);
  }
}
