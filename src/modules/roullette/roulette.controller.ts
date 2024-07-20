import {
  Controller,
  Post,
  Param,
  Body,
  Headers,
  UseGuards,
  Get,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { RouletteService } from './roullette.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { Bets } from 'src/entities/Bets.entity';
import { BetCreationDTO } from 'src/dtos/bet.dto';

@Controller('roulette')
@ApiBearerAuth()
export class RouletteController {
  constructor(private readonly rouletteService: RouletteService) {}

  @Post('create')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'New roulette creation' })
  createRoulette() {
    return this.rouletteService.create();
  }

  @Put('open/:rouletteId')
  @ApiOperation({ summary: 'Open a roulette' })
  @ApiParam({
    name: 'rouletteId',
    type: 'string',
    description: 'UUID of the roulette',
  })
  @UseGuards(AuthGuard)
  openRoulette(@Param('rouletteId') rouletteId: string) {
    return this.rouletteService.open(rouletteId);
  }

  @Post('bet/:rouletteId')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Place a bet on a roulette' })
  @ApiParam({
    name: 'rouletteId',
    type: 'string',
    description: 'UUID of the roulette',
  })
  @ApiBody({ type: BetCreationDTO })
  placeBet(
    @Param('rouletteId') rouletteId: string,
    @Headers('userid') userId: string,
    @Body() bet: Bets,
  ) {
    return this.rouletteService.placeBet(rouletteId, userId, bet);
  }

  @Get('close/:rouletteId')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Close a roulette' })
  @ApiParam({
    name: 'rouletteId',
    type: 'string',
    description: 'UUID of the roulette',
  })
  closeRoulette(@Param('rouletteId') rouletteId: string) {
    return this.rouletteService.close(rouletteId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a roulette by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'UUID of the roulette' })
  findUser(@Param('id', ParseUUIDPipe) rouletteId: string) {
    return this.rouletteService.findRoulette(rouletteId);
  }
}
