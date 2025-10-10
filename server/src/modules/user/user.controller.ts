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
import { ResponseMessage } from '../../common/decorators/responseMessage.decorator'
import { TokenPayload } from '../auth/dto/token-payload.dto'
import { JwtGuard } from '../auth/jwt.guard'
import { CreateUserDto } from './dto/create-user.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { UpdatePasswordDto } from './dto/update-password.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserService } from './user.service'
import { AdminGuard } from '../auth/admin.guard'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @HttpCode(201)
  @ResponseMessage('Create user successfully')
  @UseGuards(JwtGuard, AdminGuard)
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto)
  }

  @Get()
  @HttpCode(200)
  @ResponseMessage('Get list of users successfully')
  @UseGuards(JwtGuard)
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

  @Patch(':id/reset-password')
  @HttpCode(200)
  @ResponseMessage('Reset password successfully')
  @UseGuards(JwtGuard, AdminGuard)
  async resetPassword(@Param('id') id: string,
    @Body() dto: ResetPasswordDto,
  ) {
    return this.userService.resetPassword(id, dto)
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
  @UseGuards(JwtGuard)
  async findOne(@Param('id') id: string) {
    return this.userService.findById(id)
  }

  @Patch(':id')
  @HttpCode(200)
  @ResponseMessage('Update user successfully')
  @UseGuards(JwtGuard, AdminGuard)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto)
  }

  @Delete(':id')
  @HttpCode(200)
  @ResponseMessage('Delete user successfully')
  @UseGuards(JwtGuard, AdminGuard)
  async remove(@Param('id') id: string) {
    return this.userService.delete(id)
  }
}
