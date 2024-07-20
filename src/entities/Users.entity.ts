import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Bets } from './Bets.entity';

@Entity()
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ default: 10000 })
  credit: number;

  @OneToMany(() => Bets, (bet) => bet.user)
  bets: Bets[];
}
