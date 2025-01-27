import { PartialType } from '@nestjs/swagger';
import { CreateHealthsheetDto } from './create-healthsheet.dto';

export class UpdateHealthsheetDto extends PartialType(CreateHealthsheetDto) {}
