import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Bets } from './Bets.entity';

@Entity()
export class Roulettes {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: false })
  isOpen: boolean;

  @OneToMany(() => Bets, (bet) => bet.roulette)
  bets: Bets[];
}
