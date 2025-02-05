import { Body, Controller, Get, Post, Put, Delete, Param, Query, UseGuards, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { MercadoPagoService } from './Mp/mercadoPago';
import { CreatePaymentDto } from '../dtos/create-payment.dto';
import { UpdatePaymentDto } from '../dtos/update-payment.dto';
import { Roles } from 'src/auth/guards/roles.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Role } from 'src/auth/guards/roles.enum';

@ApiTags('Payments: Gestión de pagos')
@Controller('payment')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(
    private readonly paymentService: PaymentService,
    private readonly mercadoPagoService: MercadoPagoService,
  ) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtener todos los pagos registrados (Admin)',
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get()
  findAll() {
    return this.paymentService.findAll();
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtener un pago por ID (Admin)',
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(id);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Generar un nuevo pago (Admin)',
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post()
  async create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.create(createPaymentDto);
  }

  @ApiOperation({
    summary: 'Crear una preferencia de pago con MercadoPago',
  })
  @Post('create-preference')
  async createPreference(@Body() body: { turno: { service: string; price: number } }) {
    this.logger.log('Solicitud recibida para crear preferencia:', body);

    if (!body?.turno?.service || !body.turno.price) {
      this.logger.error('Datos inválidos:', body);
      throw new HttpException(
        'Datos inválidos: faltan service o price',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const result = await this.mercadoPagoService.createPreference({
        title: body.turno.service,
        price: body.turno.price,
      });
      this.logger.log('Preferencia creada:', result);
      return result;  // Esto debe devolver el resultado con id e init_point
    } catch (error) {
      this.logger.error('Error al crear preferencia:', error.message);
      throw new HttpException(
        `Error al crear preferencia: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Actualizar detalles de un pago (Admin)',
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Put(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentService.update(id, updatePaymentDto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Eliminar un pago (Admin)',
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentService.remove(id);
  }
}
