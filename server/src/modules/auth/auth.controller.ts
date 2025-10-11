import { Controller, Post, Body, HttpCode, Get, UseGuards, Req, HttpException, HttpStatus, Request, Res } from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterUserDto } from './dto/register-user.dto'
import { ResponseMessage } from '../../common/decorators/responseMessage.decorator'
import { LoginUserDto } from './dto/login-user.dto'
import { JwtGuard } from './jwt.guard'
import { UserService } from '../user/user.service'
import { AuthGuard } from '@nestjs/passport'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly userService: UserService) { }
  // New function to validate a token
  @Get('validate-token')
  @HttpCode(200)
  @ResponseMessage('Token is valid')
  @UseGuards(JwtGuard)
  async validateToken(@Req() request: Request) {
    return { isValid: 1 };
  }

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

  @Get('azure/callback')
  @UseGuards(AuthGuard('azure-ad'))
  async azureCallback(@Request() req, @Res() res: Response) {
    try {
      const user = req.user;
      if (!user) {
        throw new HttpException('Authentication failed', HttpStatus.UNAUTHORIZED);
      }

      // Generate JWT token
      const payload = {
        sub: user.id,
        email: user.email,
        name: user.name,
      };
      // const accessToken = this.jwtService.sign(payload);

      return {}

      // Option 2: Redirect with token (uncomment to use)
      // res.redirect(`/?token=${accessToken}`);
    } catch (error) {
      throw new HttpException('Authentication error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('profile')
  @HttpCode(200)
  @ResponseMessage('Get user profile successfully')
  @UseGuards(JwtGuard)
  async getProfile(@Req() request: Request) {
    const userPayload = await request['user']
    const user = this.authService.getProfile(userPayload.sub)
    return user
  }

  @Get('profile/azure')
  @UseGuards(AuthGuard('azure'))
  getAzureProfile(@Req() req: Request) {
    return req['user']; // Comes from Azure AD token
  }
}
