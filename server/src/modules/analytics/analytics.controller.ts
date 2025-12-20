import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AnalyticsOverviewDto } from './dto/analytics-overview.dto';
import { TokenPayload } from '../auth/dto/token-payload.dto';

@Controller('analytics')
@UseGuards(JwtGuard, RolesGuard)
@Roles('ADMIN', 'ACCOUNTING')
export class AnalyticsController {
	constructor(private readonly analyticsService: AnalyticsService) { }

	@Get('overview')
	async getOverview(@Req() request: Request,
		@Query() query: AnalyticsOverviewDto
	) {
		const userPayload: TokenPayload = await request['user']
		return this.analyticsService.getOverview(query, userPayload.sub);
	}

	@Get('revenue')
	async getRevenue(@Query('from') from?: string,
		@Query('to') to?: string,) {
		return this.analyticsService.getRevenueAnalytics(from, to);
	}
}