import { Test, TestingModule } from '@nestjs/testing';
import { AirportService } from './airport.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { AirportEntity } from '../airport/airport.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { ExceptionMessages } from '../shared/errors';

describe('AirportService', () => {
  let service: AirportService;
  let repository: Repository<AirportEntity>;
  let airportsList: AirportEntity[];

  const propertyMessage = 'message';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AirportService],
    }).compile();

    service = module.get<AirportService>(AirportService);
    repository = module.get<Repository<AirportEntity>>(
      getRepositoryToken(AirportEntity),
    );
    await seedDataBase();
  });

  const seedDataBase = async () => {
    repository.clear();
    airportsList = [];
    for (let index = 0; index < 5; index++) {
      const airport = await repository.save({
        name: faker.company.name(),
        code: faker.lorem.word(3),
        city: faker.address.cityName(),
        country: faker.address.country(),
      });
      airportsList.push(airport);
    }
  };

  const getAirportRandomFromList = () => {
    return airportsList[Math.floor(Math.random() * 5)];
  };

  const getStoredAirport = async (airport: AirportEntity) => {
    return await service.findOne(airport.id);
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all airports', async () => {
    const airports = await service.findAll();
    expect(airports).not.toBeNull();
    expect(airports).toHaveLength(airportsList.length);
  });

  it('findOne should return a airport by Id', async () => {
    const airportStored = getAirportRandomFromList();
    const airport = await service.findOne(airportStored.id);
    expect(airport).not.toBeNull();
    expect(airport.name).toEqual(airportStored.name);
    expect(airport.code).toEqual(airportStored.code);
    expect(airport.city).toEqual(airportStored.city);
    expect(airport.country).toEqual(airportStored.country);
  });

  it('findOne should throw an exception for an invalid airport', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      propertyMessage,
      ExceptionMessages.AIRPORT_NOT_FOUND,
    );
  });

  it('create should return a new airport', async () => {
    const airport: AirportEntity = {
      id: '',
      name: faker.company.name(),
      code: faker.lorem.word(3),
      city: faker.address.cityName(),
      country: faker.address.country(),
      airlines: [],
    };
    const createdAirport = await service.create(airport);
    expect(createdAirport).not.toBeNull();

    const storedAirport = await getStoredAirport(createdAirport);
    expect(storedAirport).not.toBeNull();
    expect(storedAirport.name).toEqual(createdAirport.name);
    expect(storedAirport.code).toEqual(createdAirport.code);
    expect(storedAirport.city).toEqual(createdAirport.city);
    expect(storedAirport.country).toEqual(createdAirport.country);
    expect(storedAirport.airlines).toEqual(createdAirport.airlines);
  });

  it('create should throw an exception for an invalid airport code', async () => {
    const airport: AirportEntity = {
      id: '',
      name: faker.company.name(),
      code: faker.lorem.word(4),
      city: faker.address.cityName(),
      country: faker.address.country(),
      airlines: [],
    };
    await expect(() => service.create(airport)).rejects.toHaveProperty(
      propertyMessage,
      ExceptionMessages.AIRPORT_CODE_IS_NOT_VALID,
    );
  });

  it('update should modify a airport', async () => {
    const airport = getAirportRandomFromList();
    airport.name = 'New name';
    airport.code = 'New';

    const updateAirport = await service.update(airport.id, airport);
    expect(updateAirport).not.toBeNull();

    const storedAirport = await getStoredAirport(updateAirport);
    expect(storedAirport).not.toBeNull();
    expect(storedAirport.name).toEqual(airport.name);
    expect(storedAirport.code).toEqual(airport.code);
  });

  it('update should throw an exception for an invalid airport', async () => {
    let airport = getAirportRandomFromList();
    airport = {
      ...airport,
      name: 'New name',
      code: 'New',
    };
    await expect(() => service.update('0', airport)).rejects.toHaveProperty(
      propertyMessage,
      ExceptionMessages.AIRPORT_NOT_FOUND,
    );
  });

  it('update should return an exception for an invalid airport code', async () => {
    let airport = getAirportRandomFromList();
    airport = {
      ...airport,
      name: 'New name',
      code: 'Code',
    };
    await expect(() =>
      service.update(airport.id, airport),
    ).rejects.toHaveProperty(
      propertyMessage,
      ExceptionMessages.AIRPORT_CODE_IS_NOT_VALID,
    );
  });

  it('delete should remove a airport', async () => {
    const airport = getAirportRandomFromList();
    await service.delete(airport.id);
    const allStoredAirports = await service.findAll();
    expect(allStoredAirports.length).toEqual(4);
  });

  it('delete should throw an exception for an invalid airport', async () => {
    const airport = getAirportRandomFromList();
    await service.delete(airport.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      propertyMessage,
      ExceptionMessages.AIRPORT_NOT_FOUND,
    );
  });
});
