import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { AirlineAirportService } from './airline-airport.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { AirportDto } from 'src/airport/airport.dto';
import { plainToInstance } from 'class-transformer';
import { AirportEntity } from 'src/airport/airport.entity';

@Controller('airlines')
@UseInterceptors(BusinessErrorsInterceptor)
export class AirlineAirportController {
  constructor(private readonly airlineAirportService: AirlineAirportService) {}

  @Post(':airlineId/airports/:airportId')
  async addAirportToAirline(
    @Param('airlineId') airlineId: string,
    @Param('airportId') airportId: string,
  ) {
    return await this.airlineAirportService.addAirportToAirline(
      airlineId,
      airportId,
    );
  }

  @Get(':airlineId/airports')
  async findAirportsFromAirline(@Param('airlineId') airlineId: string) {
    return await this.airlineAirportService.findAirportsFromAirline(airlineId);
  }

  @Get(':airlineId/airports/:airportId')
  async findAirportFromAirline(
    @Param('airlineId') airlineId: string,
    @Param('airportId') airportId: string,
  ) {
    return await this.airlineAirportService.findAirportFromAirline(
      airlineId,
      airportId,
    );
  }

  @Put(':airlineId/airports')
  async updateAirportsFromAirline(
    @Param('airlineId') airlineId: string,
    @Body() airportDto: AirportDto[],
  ) {
    const airports = plainToInstance(AirportEntity, airportDto);
    return await this.airlineAirportService.updateAirportsFromAirline(
      airlineId,
      airports,
    );
  }

  @Delete(':airlineId/airports/:airportId')
  @HttpCode(204)
  async deleteAirportFromAirline(
    @Param('airlineId') airlineId: string,
    @Param('airportId') airportId: string,
  ) {
    await this.airlineAirportService.deleteAirportFromAirline(
      airlineId,
      airportId,
    );
  }
}
