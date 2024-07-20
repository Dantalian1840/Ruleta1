import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users.entity';
import { UserService } from '../user/user.service';
import { UserController } from './user.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
