import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/jwt.guard';
import { CreateUserDeviceDto } from './dto/create-user-device.dto';
import { UpdateUserDeviceDto } from './dto/update-user-device.dto';
import { UserDevicesService } from './user-devices.service';
import { UserDeviceResponseDto } from './dto/use-device-response.dto';
@ApiTags('User Devices')
@Controller('user-devices')
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class UserDevicesController {
  constructor(private readonly userDevicesService: UserDevicesService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new user device' })
  @ApiResponse({ status: 201, description: 'The user device has been successfully created.', type: UserDeviceResponseDto })
  create(@Body() createUserDeviceDto: CreateUserDeviceDto) {
    return this.userDevicesService.create(createUserDeviceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all user devices' })
  @ApiResponse({ status: 200, description: 'Return a list of user devices.', type: [UserDeviceResponseDto] })
  findAll() {
    return this.userDevicesService.findAll();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all devices for a user' })
  @ApiResponse({ status: 200, description: 'Return a list of user devices.', type: [UserDeviceResponseDto] })
  findByUser(@Param('userId') userId: string) {
    return this.userDevicesService.findByUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user device by ID' })
  @ApiResponse({ status: 200, description: 'Return a single user device.', type: UserDeviceResponseDto })
  findOne(@Param('id') id: string) {
    return this.userDevicesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user device' })
  @ApiResponse({ status: 200, description: 'The user device has been successfully updated.', type: UserDeviceResponseDto })
  update(@Param('id') id: string, @Body() updateUserDeviceDto: UpdateUserDeviceDto) {
    return this.userDevicesService.update(id, updateUserDeviceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user device' })
  @ApiResponse({ status: 200, description: 'The user device has been successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.userDevicesService.remove(id);
  }
}