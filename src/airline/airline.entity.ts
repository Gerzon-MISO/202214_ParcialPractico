import { AirportEntity } from '../airport/airport.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class AirlineEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  establishmentDate: string;

  @Column()
  webPage: string;

  @ManyToMany(() => AirportEntity, (airport) => airport.airlines)
  @JoinTable()
  airports: AirportEntity[];
}
