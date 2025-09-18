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
} from '@nestjs/common'
import { NotificationService } from './notification.service'
import { CreateNotificationDto } from './dto/create-notification.dto'
import { UpdateNotificationDto } from './dto/update-notification.dto'
import { AuthGuard } from '../auth/auth.guard'
import { ResponseMessage } from '../../common/decorators/responseMessage.decorator'

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) { }

  @Post()
  @HttpCode(201)
  @UseGuards(AuthGuard)
  @ResponseMessage('Create notification successfully')
  async create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(createNotificationDto)
  }

  @Get()
  @HttpCode(200)
  @ResponseMessage('Get list of notifications successfully')
  async findAll() {
    return this.notificationService.findAll()
  }

  @Get(':id')
  @HttpCode(200)
  @ResponseMessage('Get notification detail successfully')
  async findOne(@Param('id') id: string) {
    return this.notificationService.findById(id)
  }

  @Patch(':id')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @ResponseMessage('Update notification successfully')
  async update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationService.update(id, updateNotificationDto)
  }

  @Delete(':id')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @ResponseMessage('Delete notification successfully')
  async remove(@Param('id') id: string) {
    return this.notificationService.delete(id)
  }
}
