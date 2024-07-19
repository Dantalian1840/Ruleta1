import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  //? Endpoint de creación de nuevas ruletas que devuelva el id de la nueva ruleta creada
  //? Endpoint de apertura de ruleta (el input es un id de ruleta) que permita las posteriores
  //? peticiones de apuestas, este debe devolver simplemente un estado que confirme que la operación fue exitosa o denegada.

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
