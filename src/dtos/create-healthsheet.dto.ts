import { ApiProperty } from '@nestjs/swagger';

export class CreateHealthsheetDto {
  @ApiProperty({ description: 'ID del usuario asociado a la ficha médica', example: '123e4567-e89b-12d3-a456-426614174000' })
  id_user: string;

  @ApiProperty({ description: 'URL de la planilla de salud', example: 'https://res.cloudinary.com/example/image/upload/healthsheet.pdf' })
  urlSheet: string;

  @ApiProperty({ description: 'Indica si la ficha médica es temporal', example: false })
  isTemporary: boolean;
}
