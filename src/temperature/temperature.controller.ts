import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TemperatureService } from './temperature.service';
import { CreateTemperatureDto } from './dto/create-temperature.dto';
import { UpdateTemperatureDto } from './dto/update-temperature.dto';

@Controller('temperature')
export class TemperatureController {
  constructor(private readonly temperatureService: TemperatureService) {}

  @Post()
  create(@Body() createTemperatureDto: CreateTemperatureDto) {
    return this.temperatureService.create(createTemperatureDto);
  }

  @Get()
  findAll() {
    return this.temperatureService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.temperatureService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTemperatureDto: UpdateTemperatureDto) {
    return this.temperatureService.update(+id, updateTemperatureDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.temperatureService.remove(+id);
  }
}
