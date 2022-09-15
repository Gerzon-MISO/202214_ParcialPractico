import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
  ExceptionMessages,
} from '../shared/errors';
import { Repository } from 'typeorm';
import { AirlineEntity } from './airline.entity';

@Injectable()
export class AirlineService {
  constructor(
    @InjectRepository(AirlineEntity)
    private readonly airlineRepository: Repository<AirlineEntity>,
  ) {}

  async findAll(): Promise<AirlineEntity[]> {
    return await this.airlineRepository.find({
      relations: ['airports'],
    });
  }

  async findOne(id: string): Promise<AirlineEntity> {
    return await this.findOneBy(id, ['airports']);
  }

  async create(airline: AirlineEntity): Promise<AirlineEntity> {
    this.#isInThePast(new Date(airline.establishmentDate));
    return await this.airlineRepository.save(airline);
  }

  async update(id: string, airline: AirlineEntity): Promise<AirlineEntity> {
    const persistedAirline = await this.findOneBy(id);
    this.#isInThePast(new Date(airline.establishmentDate));
    return await this.airlineRepository.save({
      ...persistedAirline,
      ...airline,
    });
  }

  async delete(id: string) {
    const airline = await this.findOneBy(id);
    return await this.airlineRepository.delete(airline);
  }

  async findOneBy(
    id: string,
    relations: Array<string> = [],
  ): Promise<AirlineEntity> {
    const airline: AirlineEntity = await this.airlineRepository.findOne({
      where: { id: id },
      relations: relations,
    });
    if (!airline) this.#handleNotFoundAirline();
    return airline;
  }

  async #handleNotFoundAirline() {
    throw new BusinessLogicException(
      ExceptionMessages.AIRLINE_NOT_FOUND,
      BusinessError.NOT_FOUND,
    );
  }

  async #isInThePast(date: Date) {
    const currentDate = new Date();
    if (date < currentDate) return;
    throw new BusinessLogicException(
      ExceptionMessages.AIRLINE_DATE_IS_NOT_VALID,
      BusinessError.PRECONDITION_FAILED,
    );
  }
}
