import { Controller, Post, Body } from '@nestjs/common';
import { ContactUsService } from './contactus.service';
import { ContactUsDto } from '../dtos/contactus.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from 'src/auth/guards/public.decorator';

@ApiTags('Contact Us: Envío de mensajes de contacto') 
@Controller('contactus')
export class ContactUsController {
  constructor(private readonly contactUsService: ContactUsService) {}
  @Public()
  @Post('/send')
  @ApiOperation({ summary: 'Enviar un mensaje de contacto' })
  @ApiResponse({ status: 201, description: 'Correo enviado correctamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async sendContactEmail(@Body() contactUsDto: ContactUsDto) {
    return this.contactUsService.sendContactEmail(contactUsDto);
  }
}
