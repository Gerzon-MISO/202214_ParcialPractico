import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
  ExceptionMessages,
} from '../shared/errors';
import { Repository } from 'typeorm';
import { AirportEntity } from './airport.entity';

@Injectable()
export class AirportService {
  constructor(
    @InjectRepository(AirportEntity)
    private readonly airportRepository: Repository<AirportEntity>,
  ) {}

  async findAll(): Promise<AirportEntity[]> {
    return await this.airportRepository.find({
      relations: ['airlines'],
    });
  }

  async findOne(id: string): Promise<AirportEntity> {
    return await this.findOneBy(id, ['airlines']);
  }

  async create(airport: AirportEntity): Promise<AirportEntity> {
    await this.#codeIsValid(airport.code);
    return await this.airportRepository.save(airport);
  }

  async update(id: string, airport: AirportEntity): Promise<AirportEntity> {
    const persistedAirport = await this.findOneBy(id);
    await this.#codeIsValid(airport.code);
    return await this.airportRepository.save({
      ...persistedAirport,
      ...airport,
    });
  }

  async delete(id: string) {
    const airport = await this.findOneBy(id);
    return await this.airportRepository.delete(airport);
  }

  async findOneBy(
    id: string,
    relations: Array<string> = [],
  ): Promise<AirportEntity> {
    const airport: AirportEntity = await this.airportRepository.findOne({
      where: { id: id },
      relations: relations,
    });
    if (!airport) await this.#handleNotFoundAirport();
    return airport;
  }

  async #handleNotFoundAirport() {
    throw new BusinessLogicException(
      ExceptionMessages.AIRPORT_NOT_FOUND,
      BusinessError.NOT_FOUND,
    );
  }

  async #codeIsValid(code: string) {
    if (code.length > 0 && code.length <= 3) return;
    throw new BusinessLogicException(
      ExceptionMessages.AIRPORT_CODE_IS_NOT_VALID,
      BusinessError.PRECONDITION_FAILED,
    );
  }
}
