import { Controller, Post, Body, HttpCode, Get, UseGuards, Req } from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterUserDto } from './dto/register-user.dto'
import { ResponseMessage } from '../../common/decorators/responseMessage.decorator'
import { LoginUserDto } from './dto/login-user.dto'
import { AuthGuard } from './auth.guard'
import { UserService } from '../user/user.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly userService: UserService) { }

  @Post('register')
  @HttpCode(200)
  @ResponseMessage('Register successfully')
  register(@Body() dto: RegisterUserDto) {
    const register = this.authService.register(dto)
    return register
  }

  @Post('login')
  @HttpCode(200)
  @ResponseMessage('Login successfully')
  login(@Body() dto: LoginUserDto) {
    const login = this.authService.login(dto)
    return login
  }

  @Get('profile')
  @HttpCode(200)
  @ResponseMessage('Get user profile successfully')
  @UseGuards(AuthGuard)
  async getProfile(@Req() request: Request) {
    const userPayload = await request['user']
    const user = this.authService.getProfile(userPayload.sub)
    return user
  }
}
