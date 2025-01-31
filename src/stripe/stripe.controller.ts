import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    ParseUUIDPipe,
    UseGuards,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { StripeService } from './stripe.service';
  import { AuthGuard } from '../auth/guards/auth.guard';
  import { RolesGuard } from '../auth/guards/roles.guards';
  import { Roles } from '../auth/guards/roles.decorator';
  import { Role } from '../auth/guards/roles.enum';
  
  @Controller('stripe')
  export class StripeController {
    constructor(private readonly stripeService: StripeService) {}
  
    @Post('create-payment-intent')
    async createPaymentIntent(@Body() body: any) {
      const { userId, amount, currency, paymentDate } = body;
      if (!userId || !amount || !currency || !paymentDate) {
        throw new HttpException('Faltan datos para el pago', HttpStatus.BAD_REQUEST);
      }
      return this.stripeService.createPaymentIntent(amount, currency, userId, paymentDate);
    }
  
    @Get('is-premium-right/:id')
    async isPremiumRight(@Param('id', ParseUUIDPipe) id: string) {
      return this.stripeService.isPremiumRight(id);
    }
  
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Get('earnings')
    async getMonthlyEarnings() {
      return this.stripeService.getMonthlyEarnings();
    }
  
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Get('total-earnings')
    async getTotalEarnings() {
      return this.stripeService.getTotalEarnings();
    }
  }