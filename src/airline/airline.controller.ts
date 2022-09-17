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
import { AirlineService } from './airline.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { AirlineDto } from './airline.dto';
import { plainToInstance } from 'class-transformer';
import { AirlineEntity } from './airline.entity';

@Controller('airlines')
@UseInterceptors(BusinessErrorsInterceptor)
export class AirlineController {
  constructor(private readonly airlineService: AirlineService) {}

  @Get()
  async findAll() {
    return await this.airlineService.findAll();
  }

  @Get(':airlineId')
  async findOne(@Param('airlineId') airlineId: string) {
    return await this.airlineService.findOne(airlineId);
  }

  @Post()
  async create(@Body() airlineDto: AirlineDto) {
    const airline = plainToInstance(AirlineEntity, airlineDto);
    return await this.airlineService.create(airline);
  }

  @Put(':airlineId')
  async update(
    @Param('airlineId') airlineId: string,
    @Body() airlineDto: AirlineDto,
  ) {
    const airline = plainToInstance(AirlineEntity, airlineDto);
    return await this.airlineService.update(airlineId, airline);
  }

  @Delete(':airlineId')
  @HttpCode(204)
  async delete(@Param('airlineId') airlineId: string) {
    await this.airlineService.delete(airlineId);
  }
}
