import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import typeOrm from './config/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './modules/user/users.module';
import { RouletteModule } from './modules/roullette/roulette.module';

//* 1. Endpoint de creación de nuevas ruletas que devuelva el id de la nueva ruleta creada

//* 2. Endpoint de apertura de ruleta (el input es un id de ruleta) que permita las posteriores
//* peticiones de apuestas, este debe devolver simplemente un estado que confirme que la operación fue exitosa o denegada.

//? 3. Endpoint de apuesta a un número (los números válidos para apostar son del 0 al 36) o color (negro o rojo) de la ruleta,
//? una cantidad determinada de dinero (máximo 10.000 dólares) a una ruleta abierta.
//? Endopint que recibe id de user en HEADER y validación de que el cliente tiene el crédito necesario.

//? Endpoint de cierre apuestas dado un id de ruleta, este endpoint debe devolver el resultado de las apuestas hechas desde
//? su apertura hasta el cierre.
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeOrm],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get('typeorm'),
    }),
    UserModule,
    RouletteModule,
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '1h' },
      secret: process.env.JWT_SECRET,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
