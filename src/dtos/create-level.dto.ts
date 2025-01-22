import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateLevelDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  description: string;
}
