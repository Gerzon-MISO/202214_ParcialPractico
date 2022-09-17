import { Test, TestingModule } from '@nestjs/testing';
import { AirlineService } from './airline.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { AirlineEntity } from './airline.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { ExceptionMessages } from '../shared/errors';

describe('AirlineService', () => {
  let service: AirlineService;
  let repository: Repository<AirlineEntity>;
  let airlinesList: AirlineEntity[];

  const propertyMessage = 'message';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AirlineService],
    }).compile();

    service = module.get<AirlineService>(AirlineService);
    repository = module.get<Repository<AirlineEntity>>(
      getRepositoryToken(AirlineEntity),
    );
    await seedDataBase();
  });

  const seedDataBase = async () => {
    repository.clear();
    airlinesList = [];
    for (let index = 0; index < 5; index++) {
      const airline = await repository.save({
        name: faker.company.name(),
        description: faker.lorem.sentence(),
        establishmentDate: faker.date.past().toISOString().split('T')[0],
        webPage: faker.internet.url(),
      });
      airlinesList.push(airline);
    }
  };

  const getAirlineRandomFromList = () => {
    return airlinesList[Math.floor(Math.random() * 5)];
  };

  const getStoredAirline = async (airline: AirlineEntity) => {
    return await service.findOne(airline.id);
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all airlines', async () => {
    const airlines = await service.findAll();
    expect(airlines).not.toBeNull();
    expect(airlines).toHaveLength(airlinesList.length);
  });

  it('findOne should return a airline by Id', async () => {
    const airlineStored = getAirlineRandomFromList();
    const airline = await service.findOne(airlineStored.id);
    expect(airline).not.toBeNull();
    expect(airline.name).toEqual(airlineStored.name);
    expect(airline.description).toEqual(airlineStored.description);
    expect(airline.establishmentDate).toEqual(airlineStored.establishmentDate);
    expect(airline.webPage).toEqual(airlineStored.webPage);
  });

  it('findOne should throw an exception for an invalid airline', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      propertyMessage,
      ExceptionMessages.AIRLINE_NOT_FOUND,
    );
  });

  it('create should return a new airline', async () => {
    const airline: AirlineEntity = {
      id: '',
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      establishmentDate: faker.date.past().toISOString().split('T')[0],
      webPage: faker.internet.url(),
      airports: [],
    };
    const createdAirline = await service.create(airline);
    expect(createdAirline).not.toBeNull();

    const storedAirline = await getStoredAirline(createdAirline);
    expect(storedAirline).not.toBeNull();
    expect(storedAirline.name).toEqual(createdAirline.name);
    expect(storedAirline.description).toEqual(createdAirline.description);
    expect(storedAirline.establishmentDate).toEqual(
      createdAirline.establishmentDate,
    );
    expect(storedAirline.webPage).toEqual(createdAirline.webPage);
    expect(storedAirline.airports).toEqual(createdAirline.airports);
  });

  it('create should throw an exception for an invalid airline establishment date', async () => {
    const airline: AirlineEntity = {
      id: '',
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      establishmentDate: faker.date.future().toISOString().split('T')[0],
      webPage: faker.internet.url(),
      airports: [],
    };
    await expect(() => service.create(airline)).rejects.toHaveProperty(
      propertyMessage,
      ExceptionMessages.AIRLINE_DATE_IS_NOT_VALID,
    );
  });

  it('update should modify a airline', async () => {
    const airline = getAirlineRandomFromList();
    airline.name = 'New name';
    airline.description = 'New description';

    const updateAirline = await service.update(airline.id, airline);
    expect(updateAirline).not.toBeNull();

    const storedAirline = await getStoredAirline(updateAirline);
    expect(storedAirline).not.toBeNull();
    expect(storedAirline.name).toEqual(airline.name);
    expect(storedAirline.description).toEqual(airline.description);
  });

  it('update should throw an exception for an invalid airline', async () => {
    let airline = getAirlineRandomFromList();
    airline = {
      ...airline,
      name: 'New name',
      description: 'New description',
    };
    await expect(() => service.update('0', airline)).rejects.toHaveProperty(
      propertyMessage,
      ExceptionMessages.AIRLINE_NOT_FOUND,
    );
  });

  it('update should return an exception for an invalid airline establishment date', async () => {
    let airline = getAirlineRandomFromList();
    airline = {
      ...airline,
      name: 'New name',
      establishmentDate: faker.date.future().toISOString().split('T')[0],
    };
    await expect(() =>
      service.update(airline.id, airline),
    ).rejects.toHaveProperty(
      propertyMessage,
      ExceptionMessages.AIRLINE_DATE_IS_NOT_VALID,
    );
  });

  it('delete should remove a airline', async () => {
    const airline = getAirlineRandomFromList();
    await service.delete(airline.id);
    const allStoredAirlines = await service.findAll();
    expect(allStoredAirlines.length).toEqual(4);
  });

  it('delete should throw an exception for an invalid airline', async () => {
    const airline = getAirlineRandomFromList();
    await service.delete(airline.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      propertyMessage,
      ExceptionMessages.AIRLINE_NOT_FOUND,
    );
  });
});
