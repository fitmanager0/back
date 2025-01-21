import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePaymentDto } from './create-payment.dto';
import { IsOptional, IsUUID } from 'class-validator';

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {
  @ApiProperty({
    description: 'Identificador único del pago',
    example: '1b2c3d4e-5f6g-7h8i-9j0k-l1m2n3o4p5q6',
  })
  @IsOptional()
  @IsUUID()
  uid?: string;
}
