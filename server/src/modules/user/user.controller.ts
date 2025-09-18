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
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { AuthGuard } from '../auth/auth.guard'
import { ResponseMessage } from '../../common/decorators/responseMessage.decorator'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @HttpCode(201)
  @UseGuards(AuthGuard)
  @ResponseMessage('Create user successfully')
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto)
  }

  @Get()
  @HttpCode(200)
  @ResponseMessage('Get list of users successfully')
  async findAll() {
    return this.userService.findAll()
  }

  @Get(':id')
  @HttpCode(200)
  @ResponseMessage('Get user detail successfully')
  async findOne(@Param('id') id: string) {
    return this.userService.findById(id)
  }

  @Patch(':id')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @ResponseMessage('Update user successfully')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto)
  }

  @Delete(':id')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @ResponseMessage('Delete user successfully')
  async remove(@Param('id') id: string) {
    return this.userService.delete(id)
  }
}
