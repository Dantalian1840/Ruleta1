import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from 'src/entities/Users.entity';
import { Roulettes } from 'src/entities/Roulettes.entity';
import { UserService } from '../user/user.service';
import { Bets } from 'src/entities/Bets.entity';

@Injectable()
export class RouletteService {
  constructor(
    @InjectRepository(Roulettes)
    private roulettesRepository: Repository<Roulettes>,
    @InjectRepository(Bets)
    private betsRepository: Repository<Bets>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    private readonly userService: UserService,
  ) {}

  async create(): Promise<string> {
    const roulette = this.roulettesRepository.create();
    const uploadRoulette = this.roulettesRepository.save(roulette);
    return `Roulette creation success with id: ${(await uploadRoulette).id}`;
  }

  async open(rouletteId: string): Promise<string> {
    const roulette = await this.roulettesRepository.findOne({
      where: { id: rouletteId },
    });
    if (roulette && !roulette.isOpen) {
      roulette.isOpen = true;
      await this.roulettesRepository.save(roulette);
      return `Roulette activation success with id: ${rouletteId}`;
    }
    return 'Roulette activation failed';
  }

  async placeBet(
    rouletteId: string,
    userId: string,
    bet: { number?: number; color?: string; amount: number },
  ): Promise<string> {
    // Searching and errors management
    const findUser = await this.userService.findUser(userId);
    if (!findUser) throw new BadRequestException('User not found');

    if (!bet.number && !bet.color)
      throw new BadRequestException('Must bet in color or number');

    const findRoulette = await this.roulettesRepository.findOne({
      where: { id: rouletteId },
      relations: ['bets'],
    });
    if (!findRoulette) throw new BadRequestException('Roulette not found');

    if (bet.number && bet.color)
      throw new BadRequestException('You cant select number and color');

    // Bet setting
    if (findUser.credit >= bet.amount && findRoulette.isOpen) {
      findUser.credit -= bet.amount;
      await this.usersRepository.save(findUser);

      const newBet: Bets = new Bets();
      newBet.color = bet.color;
      newBet.number = bet.number;
      newBet.amount = bet.amount;
      newBet.user = findUser;
      newBet.roulette = findRoulette;

      await this.betsRepository.save(newBet);
      return `Bet set successfully with number ${bet.number}`;
    }
    return 'Error setting your bet, please verify your credits or if this roulette is open';
  }

  async close(rouletteId: string): Promise<{ result: any[] }> {
    const roulette = await this.roulettesRepository.findOne({
      where: { id: rouletteId },
      relations: ['bets', 'bets.user'],
    });
    if (!roulette) throw new BadRequestException('Roulette not found');

    if (roulette.isOpen) {
      const winningNumber = Math.floor(Math.random() * 37);
      const winningColor = winningNumber % 2 === 0 ? 'red' : 'black';

      roulette.isOpen = false;

      const results = [];

      for (const bet of roulette.bets) {
        const user = await this.userService.findUser(bet.user.id); // Accede a la entidad User a través de la relación

        if (bet.number === winningNumber) {
          user.credit += bet.amount * 5;
          results.push({
            userId: user.id,
            resultValue: 'win',
            betMumber: bet.number,
            winningNumber: winningNumber,
            winningColor: winningColor,
            amount: bet.amount * 5,
            newUserAmount: bet.user.credit,
          });
        } else if (bet.color === winningColor) {
          user.credit += bet.amount * 1.8;
          results.push({
            userId: user.id,
            resultValue: 'win',
            betMumber: bet.number,
            winningNumber: winningNumber,
            amount: bet.amount * 1.8,
            newUserAmount: bet.user.credit,
          });
        } else {
          results.push({
            userId: user.id,
            resultValue: 'lose',
            betMumber: bet.number,
            winningNumber: winningNumber,
            amount: -bet.amount,
            newUserAmount: bet.user.credit,
          });
        }
        await this.usersRepository.save(user);
      }

      await this.roulettesRepository.save(roulette);
      return { result: results };
    }

    return { result: [] };
  }

  async findRoulette(id: string): Promise<Roulettes> {
    const roulette = await this.roulettesRepository.findOne({
      where: { id },
      relations: ['bets'],
    });
    if (!roulette) {
      throw new NotFoundException(`Roulette with ID ${id} not found`);
    }

    return roulette;
  }
}
