import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AblyService } from './ably.service';
import { JwtGuard } from '../auth/jwt.guard';
import { TokenPayload } from '../auth/dto/token-payload.dto';

@Controller('ably')
@UseGuards(JwtGuard)
export class AblyController {
	constructor(private readonly ablyService: AblyService) { }

	@Get('auth')
	async getAuthToken(@Req() request: Request) {
		const userPayload: TokenPayload = await request['user']
		// Endpoint này sẽ trả về JSON chứa token request đã ký
		return this.ablyService.createTokenRequest(userPayload.sub);
	}
}