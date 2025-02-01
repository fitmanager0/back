import { IsEnum, IsBoolean, IsOptional, IsIn, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAdminFieldsDto {
    @ApiProperty({
        description: 'Rol actual del usuario: Admin(1), Coach(2) o User(3)',
        example: 1,
    })
    @IsOptional()
    @IsInt({ message: 'El Id del Rol debe ser un número entero.' })
    @IsIn([1, 2, 3], {
        message: 'El Id del Rol debe ser uno de los valores: 1, 2 o 3.',
    })
    id_rol?: number;

    @ApiProperty({
        description: 'Estado actual del usuario (activo/desactivado)',
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}