import { PartialType } from '@nestjs/swagger';
import { CreateTemperatureDto } from './create-temperature.dto';

export class UpdateTemperatureDto extends PartialType(CreateTemperatureDto) {}
