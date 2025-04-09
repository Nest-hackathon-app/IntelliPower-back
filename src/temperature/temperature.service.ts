import { Injectable } from '@nestjs/common';
import { CreateTemperatureDto } from './dto/create-temperature.dto';
import { UpdateTemperatureDto } from './dto/update-temperature.dto';

@Injectable()
export class TemperatureService {
  create(createTemperatureDto: CreateTemperatureDto) {
    return 'This action adds a new temperature';
  }

  findAll() {
    return `This action returns all temperature`;
  }

  findOne(id: number) {
    return `This action returns a #${id} temperature`;
  }

  update(id: number, updateTemperatureDto: UpdateTemperatureDto) {
    return `This action updates a #${id} temperature`;
  }

  remove(id: number) {
    return `This action removes a #${id} temperature`;
  }
}
