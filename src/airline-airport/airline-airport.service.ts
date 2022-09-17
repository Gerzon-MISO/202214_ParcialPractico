import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AirlineService } from '../airline/airline.service';
import { AirportService } from '../airport/airport.service';
import { Repository } from 'typeorm';
import { AirlineEntity } from '../airline/airline.entity';
import { AirportEntity } from '../airport/airport.entity';
import {
  BusinessError,
  BusinessLogicException,
  ExceptionMessages,
} from '../shared/errors';

@Injectable()
export class AirlineAirportService {
  constructor(
    @InjectRepository(AirlineEntity)
    private readonly airlineRepository: Repository<AirlineEntity>,

    @InjectRepository(AirportEntity)
    private readonly airportRepository: Repository<AirportEntity>,

    private airlineService: AirlineService,

    private airportService: AirportService,
  ) {}

  async addAirportToAirline(
    airlineId: string,
    airportId: string,
  ): Promise<AirlineEntity> {
    const airline = await this.airlineService.findOne(airlineId);
    const airport = await this.airportService.findOneBy(airportId);
    airline.airports = [...airline.airports, airport];
    return await this.airlineRepository.save(airline);
  }

  async findAirportsFromAirline(airlineId: string): Promise<AirportEntity[]> {
    const airline = await this.airlineService.findOne(airlineId);
    return airline.airports;
  }

  async findAirportFromAirline(
    airlineId: string,
    airportId: string,
  ): Promise<AirportEntity> {
    const airline = await this.airlineService.findOne(airlineId);
    await this.airportService.findOneBy(airportId);
    const airlineAirport = this.#findAirportFromAirlineId(airportId, airline);
    return airlineAirport;
  }

  async updateAirportsFromAirline(
    airlineId: string,
    airports: AirportEntity[],
  ): Promise<AirlineEntity> {
    const airline = await this.airlineService.findOne(airlineId);
    for (let index = 0; index < airports.length; index++) {
      await this.airportService.findOneBy(airports[index].id);
    }
    airline.airports = airports;
    return await this.airlineRepository.save(airline);
  }

  async deleteAirportFromAirline(airlineId: string, airportId: string) {
    const airline = await this.airlineService.findOne(airlineId);
    await this.airportService.findOneBy(airportId);
    await this.#findAirportFromAirlineId(airportId, airline);
    airline.airports = airline.airports.filter((ap) => ap.id !== airportId);
    await this.airlineRepository.save(airline);
  }

  async #findAirportFromAirlineId(
    airportId: string,
    airline: AirlineEntity,
  ): Promise<AirportEntity> {
    const airport = airline.airports.find((ap) => ap.id === airportId);
    if (!airport)
      throw new BusinessLogicException(
        ExceptionMessages.AIRPORT_IS_NOT_ASSOCIATED,
        BusinessError.PRECONDITION_FAILED,
      );
    return airport;
  }
}
