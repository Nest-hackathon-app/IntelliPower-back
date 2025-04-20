import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Public } from 'src/auth/decorators/public.decorator';
import { FaceRecoService } from 'src/face-reco/face-reco.service';

@Controller('door')
export class DoorController {
  // Controller logic goes here @Public()
  constructor(private readonly face: FaceRecoService) {}
   @Public()
  @MessagePattern('door/open-request')
  async handleDoorOpenRequest(@Payload() data: { cameraId: string }) {
    console.log('Received door open request with payload:', data);
    console.log('Received door open request:', data.cameraId);
    return await this.face.authenticateFace(data.cameraId);
  }
}
