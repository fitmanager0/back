import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany, ManyToOne } from "typeorm";
import { ApiProperty } from '@nestjs/swagger';
import { HealthSheet } from './helthsheet.entity';
import { Payment } from './payments.entity';
import { Routine } from './routine.entity';
import { Role } from './roles.entity';

@Entity('user')
export class User {
    @PrimaryGeneratedColumn('uuid')
    @ApiProperty({ 
        description: 'Identificador único del usuario', 
        example: '123e4567-e89b-12d3-a456-426614174000', 
    })
    id_user: string;
    
    @ApiProperty({ 
        description: 'Nombre del usuario', 
        example: 'Juan Pérez' 
    })
    @Column({ type: "varchar", length: 50, nullable: false })
    
    name: string;

    @ApiProperty({ 
        description: 'Correo electrónico del usuario', 
        example: 'juan.perez@example.com' 
    })
    @Column({ type: "varchar", length: 50, nullable: false, unique: true })
    email: string;

    @ApiProperty({ 
        description: 'Contraseña del usuario', 
        example: 'ContraseñaSegura123' 
    })
    @Column({ type: 'varchar', length: 50, nullable: false })
    password: string;
 
    @ApiProperty({ 
        description: 'Identificador del rol', 
        example: 1 
    })
    @Column({ type: 'int', nullable: false })
    id_rol: number;

    @ApiProperty({ 
        description: 'Número de teléfono del usuario', 
        example: 1234567890 })
    @Column({ type: 'int', nullable: false })    
    phone: number;

    @ApiProperty({ 
        description: 'Dirección del usuario', 
        example: 'Avenida Siempre Viva 123' })
    @Column({ type: 'varchar', length: 50, nullable: false })    
    address: string;

    @ApiProperty({ 
        description: 'Ciudad del usuario', 
        example: 'Ciudad de México' })
    @Column({ type: 'varchar', length: 50, nullable: false })    
    city: string;

    @ApiProperty({ 
        description: 'País del usuario', 
        example: 'México' })
    @Column({ type: 'varchar', length: 50, nullable: false })    
    country: string;

    @ApiProperty({ 
        description: 'Indica si el usuario está activo', 
        example: true })
    @Column({ type: 'boolean', nullable: false })    
    isActive: boolean;

    @ApiProperty({ 
        description: 'Fecha de registro del usuario', 
        example: '2023-01-01' })
    @Column({ type: 'date', nullable: false })    
    entry_date: Date;

    @ApiProperty({ description: 'Hoja de salud relacionada con el usuario' })
    @OneToOne(() => HealthSheet)
    @JoinColumn({ name: 'id_user' })
    healthSheet: HealthSheet;

    @ApiProperty({ description: 'Pagos asociados al usuario' })
    @OneToMany(() => Payment, (payment) => payment.user)
    payments: Payment[];

    @ApiProperty({ description: 'Rutinas asociadas al usuario' })
    @OneToMany(() => Routine, (routine) => routine.user)
    routines: Routine[];

    @ApiProperty({ description: 'Rol del usuario' })
    @ManyToOne(() => Role, (rol) => rol.users)
    @JoinColumn({ name: 'id_rol' })
    role: Role;
}