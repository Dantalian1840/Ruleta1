import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hola, esta es la aplicación de prueba para una ruleta, puedes ver la documentación en: http://localhost:3000/api';
  }
}
