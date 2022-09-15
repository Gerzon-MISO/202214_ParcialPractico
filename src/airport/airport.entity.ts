import { AirlineEntity } from 'src/airline/airline.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class AirportEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  code: string;

  @Column()
  city: string;

  @Column()
  country: string;

  @ManyToMany(() => AirlineEntity, (airline) => airline.airports)
  @JoinTable()
  airlines: AirlineEntity[];
}
