import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common'
import { ConfigService } from './config.service'
import { CreateConfigDto } from './dto/create-config.dto'
import { UpdateConfigDto } from './dto/update-config.dto'
import { JwtGuard } from '../auth/jwt.guard'
import { ResponseMessage } from '../../common/decorators/responseMessage.decorator'
import { TokenPayload } from '../auth/dto/token-payload.dto'

@Controller('configs')
export class ConfigController {
  constructor(private readonly configService: ConfigService) { }

  @Post()
  @HttpCode(201)
  @ResponseMessage('Config created successfully')
  @UseGuards(JwtGuard)
  create(@Req() request: Request, @Body() dto: CreateConfigDto) {
    const userPayload: TokenPayload = request['user']
    return this.configService.create(userPayload.sub, dto)
  }

  @Get()
  @HttpCode(200)
  @ResponseMessage('Get list of configs successfully')
  @UseGuards(JwtGuard)
  findAll(@Req() request: Request) {
    const userPayload: TokenPayload = request['user']
    return this.configService.findAll(userPayload.sub)
  }

  @Get(':id')
  @HttpCode(200)
  @ResponseMessage('Get config detail successfully')
  @UseGuards(JwtGuard)
  findOne(@Req() request: Request, @Param('id') id: string) {
    const userPayload: TokenPayload = request['user']
    return this.configService.findById(userPayload.sub, id)
  }

  @Get('code/:code')
  @HttpCode(200)
  @ResponseMessage('Get config by code successfully')
  @UseGuards(JwtGuard)
  findByCode(@Req() request: Request, @Param('code') code: string) {
    const userPayload: TokenPayload = request['user']
    return this.configService.findByCode(userPayload.sub, code)
  }

  @Patch(':id')
  @HttpCode(200)
  @ResponseMessage('Update config successfully')
  @UseGuards(JwtGuard)
  update(@Req() request: Request, @Param('id') id: string, @Body() dto: UpdateConfigDto) {
    const userPayload: TokenPayload = request['user']
    return this.configService.update(userPayload.sub, id, dto)
  }

  @Patch('code/:code')
  @HttpCode(200)
  @ResponseMessage('Update config by code successfully')
  @UseGuards(JwtGuard)
  updateByCode(@Req() request: Request, @Param('code') code: string, @Body() dto: UpdateConfigDto) {
    const userPayload: TokenPayload = request['user']
    return this.configService.updateByCode(userPayload.sub, code, dto)
  }

  @Delete(':id')
  @HttpCode(200)
  @ResponseMessage('Delete config successfully')
  @UseGuards(JwtGuard)
  remove(@Req() request: Request, @Param('id') id: string) {
    const userPayload: TokenPayload = request['user']
    return this.configService.delete(userPayload.sub, id)
  }
}
