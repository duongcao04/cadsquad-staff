import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseGuards,
  Req,
} from '@nestjs/common'
import { NotificationService } from './notification.service'
import { CreateNotificationDto } from './dto/create-notification.dto'
import { UpdateNotificationDto } from './dto/update-notification.dto'
import { JwtGuard } from '../auth/jwt.guard'
import { ResponseMessage } from '../../common/decorators/responseMessage.decorator'
import { TokenPayload } from '../auth/dto/token-payload.dto'

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) { }

  @Post('/send')
  @HttpCode(201)
  @UseGuards(JwtGuard)
  @ResponseMessage('Create notification successfully')
  async create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(createNotificationDto)
  }

  @Get()
  @HttpCode(200)
  @ResponseMessage('Get list of notifications successfully')
  @UseGuards(JwtGuard)
  async findAll(@Req() request: Request) {
    const userPayload: TokenPayload = await request['user']
    return this.notificationService.findAll(userPayload.sub)
  }

  @Get(':id')
  @HttpCode(200)
  @ResponseMessage('Get notification detail successfully')
  async findOne(@Param('id') id: string) {
    return this.notificationService.findById(id)
  }

  @Patch(':id')
  @HttpCode(200)
  @UseGuards(JwtGuard)
  @ResponseMessage('Update notification successfully')
  async update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationService.update(id, updateNotificationDto)
  }

  @Delete(':id')
  @HttpCode(200)
  @UseGuards(JwtGuard)
  @ResponseMessage('Delete notification successfully')
  async remove(@Param('id') id: string) {
    return this.notificationService.delete(id)
  }
}
