import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID, IsDateString, IsDecimal } from 'class-validator';

// Excluimos `uid` de `UpdatePaymentDto` de manera explícita
export class UpdatePaymentDto {
  @ApiProperty({
    description: 'Fecha en la que se realizó el pago',
    example: '2025-01-20 10:30',
    required: false,
  })
  @IsOptional() // Solo obligatorio si se quiere modificar
  @IsDateString()
  pay_date: Date;

  @ApiProperty({
    description: 'Fecha de inicio de la suscripción',
    example: '2025-01-01 00:00',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  initial_subscription_date: Date;

  @ApiProperty({
    description: 'Fecha de finalización de la suscripción',
    example: '2025-12-31 23:59',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  final_subscription_date: Date;

  @ApiProperty({
    description: 'Monto pagado por el usuario',
    example: 49.99,
    required: false,
  })
  @IsOptional()
  @IsDecimal()
  amount: number;
}
