import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Users } from './Users.entity';
import { Roulettes } from './Roulettes.entity';

@Entity()
export class Bets {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  amount: number;

  @Column({ nullable: true })
  number?: number;

  @Column({ nullable: true, type: 'varchar', length: 10 })
  color?: string; // Possibly values 'red' or 'black'

  @ManyToOne(() => Users, (user) => user.bets)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @ManyToOne(() => Roulettes, (roulette) => roulette.bets)
  @JoinColumn({ name: 'roulette_id' })
  roulette: Roulettes;
}
