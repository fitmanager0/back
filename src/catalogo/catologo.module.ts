import { Module } from '@nestjs/common';
import { CatalogoService } from './catalogo.service';
import { CatalogoController } from './catalogo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Catalogo } from '../entities/catalogo.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Catalogo]),
    UserModule
  ],
  controllers: [CatalogoController],
  providers: [CatalogoService],
  exports: [CatalogoService]
})
export class CatalogoModule {}