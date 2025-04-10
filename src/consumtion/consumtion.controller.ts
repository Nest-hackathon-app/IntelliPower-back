import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ConsumtionService } from './consumtion.service';
import { CreateConsumtionDto } from './dto/create-consumtion.dto';
import { UpdateConsumtionDto } from './dto/update-consumtion.dto';

@Controller('consumtion')
export class ConsumtionController {
  constructor(private readonly consumtionService: ConsumtionService) {}

  @Post()
  create(@Body() createConsumtionDto: CreateConsumtionDto) {
    return this.consumtionService.create(createConsumtionDto);
  }

  @Get()
  findAll() {
    return this.consumtionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.consumtionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConsumtionDto: UpdateConsumtionDto) {
    return this.consumtionService.update(+id, updateConsumtionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.consumtionService.remove(+id);
  }
}
