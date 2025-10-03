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
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { JwtGuard } from '../auth/jwt.guard'
import { ResponseMessage } from '../../common/decorators/responseMessage.decorator'
import { UpdatePasswordDto } from './dto/update-password.dto'
import { TokenPayload } from '../auth/dto/token-payload.dto'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @HttpCode(201)
  @UseGuards(JwtGuard)
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

  @Patch('update-password')
  @HttpCode(200)
  @UseGuards(JwtGuard)
  @ResponseMessage('Update password successfully')
  async updatePassword(@Req() request: Request,
    @Body() dto: UpdatePasswordDto,
  ) {
    const userPayload: TokenPayload = await request['user']
    return this.userService.updatePassword(userPayload.sub, dto)
  }


  @Get('username/:username')
  @HttpCode(200)
  @ResponseMessage('Check username successfully')
  @UseGuards(JwtGuard)
  async checkUsernameValid(@Param('username') username: string) {
    return this.userService.checkUsernameValid(username)
  }

  @Get(':id')
  @HttpCode(200)
  @ResponseMessage('Get user detail successfully')
  async findOne(@Param('id') id: string) {
    return this.userService.findById(id)
  }

  @Patch(':id')
  @HttpCode(200)
  @UseGuards(JwtGuard)
  @ResponseMessage('Update user successfully')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto)
  }

  @Delete(':id')
  @HttpCode(200)
  @UseGuards(JwtGuard)
  @ResponseMessage('Delete user successfully')
  async remove(@Param('id') id: string) {
    return this.userService.delete(id)
  }
}
