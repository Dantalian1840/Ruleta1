import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roulettes } from 'src/entities/Roulettes.entity';
import { Users } from 'src/entities/Users.entity';
import { RouletteController } from './roulette.controller';
import { RouletteService } from './roullette.service';
import { UserService } from '../user/user.service';
import { Bets } from 'src/entities/Bets.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Roulettes, Users, Bets])],
  controllers: [RouletteController],
  providers: [RouletteService, UserService],
})
export class RouletteModule {}
