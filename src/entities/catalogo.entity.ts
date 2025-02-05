import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('catalogo')
export class Catalogo {
  @ApiProperty({
    description: 'Identificador único de la imagen del catalogo de rutina',
    example: 'uuid-example-1234',
  })
  @PrimaryGeneratedColumn('uuid')
  id_cat: string;

  @ApiProperty({
    description: 'Nivel de la rutina (1 - INICIAL, 2 - INTERMEDIO, 3 - AVANZADO)',
    example: 2,
  })
  @Column({ type: 'int', nullable: false })
  id_level: number;

  @ApiProperty({
    description: 'URL de la imagen almacenada en Cloudinary',
    example: 'https://res.cloudinary.com/demo/image/upload/v12345/routine.jpg',
  })
  @Column({ type: 'varchar', length: 255, nullable: false })
  url_imagen: string;
}

