import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Post, Req, Request, Res, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ResponseMessage } from '../../common/decorators/responseMessage.decorator'
import { UserService } from '../user/user.service'
import { AuthService } from './auth.service'
import { LoginUserDto } from './dto/login-user.dto'
import { RegisterUserDto } from './dto/register-user.dto'
import { JwtGuard } from './jwt.guard'

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
        displayName: user.displayName,
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
