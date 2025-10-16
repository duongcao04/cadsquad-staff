import { Module } from '@nestjs/common';
import { BrowserSubscribesService } from './browser-subscribes.service';
import { BrowserSubscribesController } from './browser-subscribes.controller';

@Module({
  controllers: [BrowserSubscribesController],
  providers: [BrowserSubscribesService],
})
export class BrowserSubscribesModule {}
