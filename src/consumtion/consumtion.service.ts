import { Injectable } from '@nestjs/common';
import { CreateConsumtionDto } from './dto/create-consumtion.dto';
import { UpdateConsumtionDto } from './dto/update-consumtion.dto';

@Injectable()
export class ConsumtionService {
  create(createConsumtionDto: CreateConsumtionDto) {
    return 'This action adds a new consumtion';
  }

  findAll() {
    return `This action returns all consumtion`;
  }

  findOne(id: number) {
    return `This action returns a #${id} consumtion`;
  }

  update(id: number, updateConsumtionDto: UpdateConsumtionDto) {
    return `This action updates a #${id} consumtion`;
  }

  remove(id: number) {
    return `This action removes a #${id} consumtion`;
  }
}
