import { PartialType } from '@nestjs/swagger';
import { CreateConsumtionDto } from './create-consumtion.dto';

export class UpdateConsumtionDto extends PartialType(CreateConsumtionDto) {}
