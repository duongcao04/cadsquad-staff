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
import { CreateNotificationDto } from './dto/create-notification.dto'
import { NotificationResponseDto } from './dto/notification-response.dto'
import { UpdateNotificationDto } from './dto/update-notification.dto'
import { NotificationService } from './notification.service'

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) { }

  @Post('/send')
  @HttpCode(201)
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ResponseMessage('Create notification successfully')
  @ApiOperation({ summary: 'Create and send a new notification' })
  @ApiResponse({
    status: 201,
    description: 'The notification has been successfully created.',
    type: NotificationResponseDto,
  })
  async create(
    @Req() request: Request,
    @Body() createNotificationDto: CreateNotificationDto,
  ) {
    const userPayload: TokenPayload = await request['user']
    createNotificationDto.senderId = userPayload.sub

    return this.notificationService.create(createNotificationDto)
  }

  @Get()
  @HttpCode(200)
  @ResponseMessage('Get list of notifications successfully')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all notifications for the current user' })
  @ApiResponse({
    status: 200,
    description: 'Return a list of notifications.',
    type: [NotificationResponseDto],
  })
  async findAll(@Req() request: Request) {
    const userPayload: TokenPayload = await request['user']
    return this.notificationService.findAll(userPayload.sub)
  }

  @Get(':id')
  @HttpCode(200)
  @ResponseMessage('Get notification detail successfully')
  @ApiOperation({ summary: 'Get a notification by its ID' })
  @ApiResponse({
    status: 200,
    description: 'Return a single notification.',
    type: NotificationResponseDto,
  })
  async findOne(@Param('id') id: string) {
    return this.notificationService.findById(id)
  }

  @Patch(':id')
  @HttpCode(200)
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ResponseMessage('Update notification successfully')
  @ApiOperation({ summary: 'Update a notification' })
  @ApiResponse({
    status: 200,
    description: 'The notification has been successfully updated.',
    type: NotificationResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationService.update(id, updateNotificationDto)
  }

  @Delete(':id')
  @HttpCode(200)
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ResponseMessage('Delete notification successfully')
  @ApiOperation({ summary: 'Delete a notification' })
  @ApiResponse({
    status: 200,
    description: 'The notification has been successfully deleted.',
  })
  async remove(@Param('id') id: string) {
    return this.notificationService.delete(id)
  }
}
