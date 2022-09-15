import { Test, TestingModule } from '@nestjs/testing';
import { AirportService } from './airport.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('AirportService', () => {
  let service: AirportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AirportService],
    }).compile();

    service = module.get<AirportService>(AirportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
