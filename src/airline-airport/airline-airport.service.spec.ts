import { Test, TestingModule } from '@nestjs/testing';
import { AirlineAirportService } from './airline-airport.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { AirlineService } from '../airline/airline.service';
import { AirportService } from '../airport/airport.service';

describe('AirlineAirportService', () => {
  let service: AirlineAirportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AirlineAirportService, AirlineService, AirportService],
    }).compile();

    service = module.get<AirlineAirportService>(AirlineAirportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
