import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { BrowserSubscribesService } from './browser-subscribes.service';
import { CreateBrowserSubscribeDto } from './dto/create-browser-subscribe.dto';
import { UpdateBrowserSubscribeDto } from './dto/update-browser-subscribe.dto';

@Controller('browser-subscribes')
export class BrowserSubscribesController {
  constructor(
    private readonly browserSubscribesService: BrowserSubscribesService,
  ) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createBrowserSubscribeDto: CreateBrowserSubscribeDto) {
    return this.browserSubscribesService.create(createBrowserSubscribeDto);
  }

  @Get()
  findAll() {
    return this.browserSubscribesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.browserSubscribesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBrowserSubscribeDto: UpdateBrowserSubscribeDto,
  ) {
    return this.browserSubscribesService.update(id, updateBrowserSubscribeDto);
  }

  @Delete('by-endpoint')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeByEndpoint(@Body() { endpoint }: { endpoint: string }) {
    return this.browserSubscribesService.removeByEndpoint(endpoint);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.browserSubscribesService.remove(id);
  }
}