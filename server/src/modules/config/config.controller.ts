import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { ResponseMessage } from '../../common/decorators/responseMessage.decorator'
import { JwtGuard } from '../auth/jwt.guard'
import { TokenPayload } from '../auth/dto/token-payload.dto'
import { ConfigService } from './config.service'
import { CreateConfigDto } from './dto/create-config.dto'
import { UpdateConfigDto } from './dto/update-config.dto'
import { ConfigResponseDto } from './dto/config-response.dto'

@ApiTags('Configs')
@Controller('configs')
export class ConfigController {
  constructor(private readonly configService: ConfigService) { }

  @Post()
  @HttpCode(201)
  @ResponseMessage('Config created successfully')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new config' })
  @ApiResponse({
    status: 201,
    description: 'The config has been successfully created.',
    type: ConfigResponseDto,
  })
  create(@Req() request: Request, @Body() dto: CreateConfigDto) {
    const userPayload: TokenPayload = request['user']
    return this.configService.create(userPayload.sub, dto)
  }

  @Get()
  @HttpCode(200)
  @ResponseMessage('Get list of configs successfully')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all configs for the current user' })
  @ApiResponse({
    status: 200,
    description: 'Return a list of configs.',
    type: [ConfigResponseDto],
  })
  findAll(@Req() request: Request) {
    const userPayload: TokenPayload = request['user']
    return this.configService.findAll(userPayload.sub)
  }

  @Get(':id')
  @HttpCode(200)
  @ResponseMessage('Get config detail successfully')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a config by its ID' })
  @ApiResponse({
    status: 200,
    description: 'Return a single config.',
    type: ConfigResponseDto,
  })
  findOne(@Req() request: Request, @Param('id') id: string) {
    const userPayload: TokenPayload = request['user']
    return this.configService.findById(userPayload.sub, id)
  }

  @Get('code/:code')
  @HttpCode(200)
  @ResponseMessage('Get config by code successfully')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a config by its code' })
  @ApiResponse({
    status: 200,
    description: 'Return a single config.',
    type: ConfigResponseDto,
  })
  findByCode(@Req() request: Request, @Param('code') code: string) {
    const userPayload: TokenPayload = request['user']
    return this.configService.findByCode(userPayload.sub, code)
  }

  @Patch(':id')
  @HttpCode(200)
  @ResponseMessage('Update config successfully')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a config by its ID' })
  @ApiResponse({
    status: 200,
    description: 'The config has been successfully updated.',
    type: ConfigResponseDto,
  })
  update(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() dto: UpdateConfigDto,
  ) {
    const userPayload: TokenPayload = request['user']
    return this.configService.update(userPayload.sub, id, dto)
  }

  @Patch('code/:code')
  @HttpCode(200)
  @ResponseMessage('Update config by code successfully')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a config by its code' })
  @ApiResponse({
    status: 200,
    description: 'The config has been successfully updated.',
    type: ConfigResponseDto,
  })
  updateByCode(
    @Req() request: Request,
    @Param('code') code: string,
    @Body() dto: UpdateConfigDto,
  ) {
    const userPayload: TokenPayload = request['user']
    return this.configService.updateByCode(userPayload.sub, code, dto)
  }

  @Delete(':id')
  @HttpCode(200)
  @ResponseMessage('Delete config successfully')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a config by its ID' })
  @ApiResponse({
    status: 200,
    description: 'The config has been successfully deleted.',
  })
  remove(@Req() request: Request, @Param('id') id: string) {
    const userPayload: TokenPayload = request['user']
    return this.configService.delete(userPayload.sub, id)
  }
}
