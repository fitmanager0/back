import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: 'localhost',
    //   port: 5432,
    //   username: 'tu_usuario',
    //   password: 'tu_contraseña',
    //   database: 'tu_base_de_datos',
    //   autoLoadEntities: true,
    //   synchronize: true, 
    // }),
    // TypeOrmModule.forFeature(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
