import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { LoginUsersDTO } from 'src/dtos/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(username: string, password: string): Promise<Users> {
    const newUser: Users = new Users();
    newUser.username = username;
    newUser.password = password;
    newUser.credit = 10000;

    return this.usersRepository.save(newUser);
  }

  async login(login: LoginUsersDTO) {
    const { username, password } = login;
    try {
      const user = await this.usersRepository.findOne({ where: { username } });
      if (!user) {
        throw new NotFoundException(`User with username ${username} not found`);
      }
      if (password !== user.password) {
        throw new BadRequestException('Incorrect Credentials');
      }

      const payload = {
        id: user.id,
        username: user.username,
      };

      const secret = process.env.JWT_SECRET;

      if (!secret) {
        throw new UnauthorizedException(
          'JWT_SECRET not found in environment variables',
        );
      }

      const token = this.jwtService.sign(payload, { secret });

      return {
        message: 'User succesfully loged in!',
        id: user.id,
        username: user.username,
        token,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException('Usuario no registrado');
      }
      throw error;
    }
  }

  async findUser(id: string): Promise<Users> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['bets'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }
}
