import { Controller } from '@nestjs/common';
import { BuzzerService } from './buzzer.service';

@Controller('buzzer')
export class BuzzerController {
  constructor(private readonly buzzerService: BuzzerService) {}
}
