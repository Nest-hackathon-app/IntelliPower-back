import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
Global();
@Module({
  imports: [HttpModule.register({ timeout: 150000,maxRedirects: 5 })],
  exports: [HttpModule],
})
export class HttpWrapperModule {}
