import { Test, TestingModule } from '@nestjs/testing';
import { AirlineAirportService } from './airline-airport.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { AirlineService } from '../airline/airline.service';
import { AirportService } from '../airport/airport.service';
import { Repository } from 'typeorm';
import { AirlineEntity } from '../airline/airline.entity';
import { AirportEntity } from '../airport/airport.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { ExceptionMessages } from '../shared/errors';

describe('AirlineAirportService', () => {
  let service: AirlineAirportService;
  let airlineRepository: Repository<AirlineEntity>;
  let airportRepository: Repository<AirportEntity>;
  let airportsList: AirportEntity[];
  let airline: AirlineEntity;
  let airlineService: AirlineService;

  const propertyMessage = 'message';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AirlineAirportService, AirlineService, AirportService],
    }).compile();

    service = module.get<AirlineAirportService>(AirlineAirportService);
    airlineService = module.get<AirlineService>(AirlineService);
    airlineRepository = module.get<Repository<AirlineEntity>>(
      getRepositoryToken(AirlineEntity),
    );
    airportRepository = module.get<Repository<AirportEntity>>(
      getRepositoryToken(AirportEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    airlineRepository.clear();
    airportRepository.clear();
    airportsList = [];

    for (let index = 0; index < 5; index++) {
      const airport = await createAirport();
      airportsList.push(airport);
    }

    airline = await createAirline(airportsList);
  };

  const createAirline = async (airports = []) => {
    return await airlineRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      establishmentDate: faker.date.past().toISOString().split('T')[0],
      webPage: faker.internet.url(),
      airports: airports,
    });
  };

  const createAirport = async () => {
    return await airportRepository.save({
      name: faker.company.name(),
      code: faker.lorem.word(3),
      city: faker.address.cityName(),
      country: faker.address.country(),
    });
  };

  const getAirportRandomFromList = () => {
    return airportsList[Math.floor(Math.random() * 5)];
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addAirportToAirline should add an airport to an airline', async () => {
    const airline = await createAirline();
    const airport = await createAirport();
    const result = await service.addAirportToAirline(airline.id, airport.id);
    expect(result.airports.length).toBe(1);
    expect(result.airports[0]).not.toBeNull();
    expect(result.airports[0].name).toBe(airport.name);
    expect(result.airports[0].code).toBe(airport.code);
    expect(result.airports[0].city).toBe(airport.city);
    expect(result.airports[0].country).toBe(airport.country);
  });

  it('addAirportToAirline throw exception for an invalid airport', async () => {
    const airline = await createAirline();
    await expect(() =>
      service.addAirportToAirline(airline.id, '0'),
    ).rejects.toHaveProperty(
      propertyMessage,
      ExceptionMessages.AIRPORT_NOT_FOUND,
    );
  });

  it('addAirportToAirline throw exception for an invalid airline', async () => {
    const airport = await createAirport();
    await expect(() =>
      service.addAirportToAirline('0', airport.id),
    ).rejects.toHaveProperty(
      propertyMessage,
      ExceptionMessages.AIRLINE_NOT_FOUND,
    );
  });

  it('findAirportsFromAirline should return airports from airline', async () => {
    const airports = await service.findAirportsFromAirline(airline.id);
    expect(airports).not.toBeNull();
    expect(airports.length).toBe(5);
  });

  it('findAirportsFromAirline should throw an exception for an invalid airline', async () => {
    await expect(() =>
      service.findAirportsFromAirline('0'),
    ).rejects.toHaveProperty(
      propertyMessage,
      ExceptionMessages.AIRLINE_NOT_FOUND,
    );
  });

  it('findAirportFromAirline should return an airport from airline', async () => {
    const airport = getAirportRandomFromList();
    const storedAirport = await service.findAirportFromAirline(
      airline.id,
      airport.id,
    );
    expect(storedAirport).not.toBeNull();
    expect(storedAirport.name).toBe(airport.name);
    expect(storedAirport.code).toBe(airport.code);
    expect(storedAirport.city).toBe(airport.city);
    expect(storedAirport.country).toBe(airport.country);
  });

  it('findAirportFromAirline should throw an exception for an invalid airport', async () => {
    await expect(() =>
      service.findAirportFromAirline(airline.id, '0'),
    ).rejects.toHaveProperty(
      propertyMessage,
      ExceptionMessages.AIRPORT_NOT_FOUND,
    );
  });

  it('findAirportFromAirline should throw an exception for an invalid airline', async () => {
    const airport = getAirportRandomFromList();
    await expect(() =>
      service.findAirportFromAirline('0', airport.id),
    ).rejects.toHaveProperty(
      propertyMessage,
      ExceptionMessages.AIRLINE_NOT_FOUND,
    );
  });

  it('findAirportFromAirline should throw an exception for an airport not associated to the airline', async () => {
    const airport = await createAirport();
    await expect(() =>
      service.findAirportFromAirline(airline.id, airport.id),
    ).rejects.toHaveProperty(
      propertyMessage,
      ExceptionMessages.AIRPORT_IS_NOT_ASSOCIATED,
    );
  });

  it('updateAirportsFromAirline should update airports list for an airline', async () => {
    const airport = await createAirport();
    const result = await service.updateAirportsFromAirline(airline.id, [
      airport,
    ]);
    expect(result).not.toBeNull();
    expect(result.airports.length).toBe(1);
    expect(result.airports[0].name).toBe(airport.name);
    expect(result.airports[0].code).toBe(airport.code);
    expect(result.airports[0].city).toBe(airport.city);
    expect(result.airports[0].country).toBe(airport.country);
  });

  it('updateAirportsFromAirline should throw an exception for an invalid airline', async () => {
    const airport = await createAirport();
    await expect(() =>
      service.updateAirportsFromAirline('0', [airport]),
    ).rejects.toHaveProperty(
      propertyMessage,
      ExceptionMessages.AIRLINE_NOT_FOUND,
    );
  });

  it('updateAirportsFromAirline should throw an exception for an invalid airport', async () => {
    const airport = await createAirport();
    airport.id = '0';
    await expect(() =>
      service.updateAirportsFromAirline(airline.id, [airport]),
    ).rejects.toHaveProperty(
      propertyMessage,
      ExceptionMessages.AIRPORT_NOT_FOUND,
    );
  });

  it('deleteAirportFromAirline should remove an airport from airline', async () => {
    const airport = getAirportRandomFromList();
    await service.deleteAirportFromAirline(airline.id, airport.id);
    const storedAirline = await airlineService.findOne(airline.id);
    const deletedAirport = storedAirline.airports.find(
      (ap) => ap.id === airport.id,
    );
    expect(deletedAirport).toBeUndefined();
    expect(storedAirline.airports.length).toBe(airportsList.length - 1);
  });

  it('deleteAirportFromAirline should throw an exception for an invalid airline', async () => {
    const airport = getAirportRandomFromList();
    await expect(() =>
      service.deleteAirportFromAirline('0', airport.id),
    ).rejects.toHaveProperty(
      propertyMessage,
      ExceptionMessages.AIRLINE_NOT_FOUND,
    );
  });

  it('deleteAirportFromAirline should throw an exception for an invalid airport', async () => {
    await expect(() =>
      service.deleteAirportFromAirline(airline.id, '0'),
    ).rejects.toHaveProperty(
      propertyMessage,
      ExceptionMessages.AIRPORT_NOT_FOUND,
    );
  });

  it('deleteAirportFromAirline should throw an exception for an airport not associated to the airline', async () => {
    const airport = await createAirport();
    await expect(() =>
      service.deleteAirportFromAirline(airline.id, airport.id),
    ).rejects.toHaveProperty(
      propertyMessage,
      ExceptionMessages.AIRPORT_IS_NOT_ASSOCIATED,
    );
    const storedAirline = await airlineService.findOne(airline.id);
    expect(storedAirline.airports.length).toBe(5);
  });
});
