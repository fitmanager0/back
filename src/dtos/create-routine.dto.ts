import { IsUUID, IsString, IsNotEmpty } from 'class-validator';

export class CreateRoutineDto {
  @IsString()
  @IsNotEmpty()
  url_routine: string;

  @IsUUID()
  @IsNotEmpty()
  id_user: string;

  @IsUUID()
  @IsNotEmpty()
  id_level: string;
}
