import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  UseGuards,
  HttpException,
  HttpStatus,
  Logger,
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
import { UserService } from 'src/user/user.service';
import { MailService } from 'src/mail/mail.service';

@ApiTags('Payments: Gestión de pagos')
@Controller('payment')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(
    private readonly paymentService: PaymentService,
    private readonly mercadoPagoService: MercadoPagoService,
    private readonly userService: UserService,
    private readonly mailService: MailService
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

  @ApiOperation({ summary: 'Crear una preferencia de pago con MercadoPago' })
  @Post('create-preference')
  async createPreference(
    @Body()
    body: {
      turno: { service: string; price: number };
      userId: string;
      userEmail: string;
    },
  ) {
    this.logger.log('Datos recibidos:', body);

    try {
      // Crear la preferencia de pago y retornar el resultado
      const result = await this.mercadoPagoService.createPreference(
        { title: body.turno.service, price: body.turno.price },
        body.userId,
        body.userEmail,
      );
      return result;
    } catch (error: any) {
      this.logger.error('Error en el proceso de pago:', error.message);
      throw new Error(`Error en el proceso de pago: ${error.message}`);
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


  

  @Post('test-email-success')
  async testEmailSuccess(@Body() body: { email: string; name: string; amount: number }) {
    return this.mailService.sendPaymentSuccessNotification(body.email, body.name, body.amount);
  }

  @Post('test-email-failure')
  async testEmailFailure(@Body() body: { email: string; name: string; amount: number; errorMessage: string }) {
    return this.mailService.sendPaymentFailureNotification(body.email, body.name, body.amount, body.errorMessage);
  }


}
