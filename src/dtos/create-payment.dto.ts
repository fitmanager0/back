import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsDateString, IsDecimal } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({
    description: 'Clave foránea que referencia al usuario que realizó el pago',
    example: '2e3f4g5h-6i7j-8k9l-0m1n-2o3p4q5r6s7t',
  })
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'Fecha en la que se realizó el pago',
    example: '2025-01-20 10:30',
  })
  @IsNotEmpty()
  @IsDateString()
  pay_date: Date;

  @ApiProperty({
    description: 'Fecha de inicio de la suscripción',
    example: '2025-01-01 00:00',
  })
  @IsNotEmpty()
  @IsDateString()
  initial_subscription_date: Date;

  @ApiProperty({
    description: 'Fecha de finalización de la suscripción',
    example: '2025-12-31 23:59',
  })
  @IsNotEmpty()
  @IsDateString()
  final_subscription_date: Date;

  @ApiProperty({
    description: 'Monto pagado por el usuario',
    example: 49.99,
  })
  @IsNotEmpty()
  @IsDecimal()
  amount: number;

  // NOTA: Eliminamos el campo 'uid' del DTO, ya que se genera automáticamente
}
