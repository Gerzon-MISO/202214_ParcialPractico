import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirlineModule } from '../airline/airline.module';
import { AirportModule } from '../airport/airport.module';
import { AirlineEntity } from '../airline/airline.entity';
import { AirportEntity } from '../airport/airport.entity';
import { AirlineAirportService } from './airline-airport.service';
import { AirlineAirportController } from './airline-airport.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([AirlineEntity, AirportEntity]),
    AirlineModule,
    AirportModule,
  ],
  providers: [AirlineAirportService],
  controllers: [AirlineAirportController],
})
export class AirlineAirportModule {}
