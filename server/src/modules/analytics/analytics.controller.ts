import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AnalyticsOverviewDto } from './dto/analytics-overview.dto';
import { TokenPayload } from '../auth/dto/token-payload.dto';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';

@Controller('analytics')
@UseGuards(JwtGuard, RolesGuard)
export class AnalyticsController {
	constructor(private readonly analyticsService: AnalyticsService) { }

	@Get('overview')
	@Roles('ADMIN', 'ACCOUNTING')
	async getOverview(@Req() request: Request,
		@Query() query: AnalyticsOverviewDto
	) {
		const userPayload: TokenPayload = await request['user']
		return this.analyticsService.getOverview(query, userPayload.sub);
	}

	@Get('revenue')
	@Roles('ADMIN', 'ACCOUNTING')
	async getRevenue(@Query('from') from?: string,
		@Query('to') to?: string,) {
		return this.analyticsService.getRevenueAnalytics(from, to);
	}

	@Get('profile-overview')
	@ApiOperation({ summary: 'Get user financial overview, job stats, and charts' })
	@ApiQuery({ name: 'from', required: false, type: String, description: 'Start date (YYYY-MM-DD)' })
	@ApiQuery({ name: 'to', required: false, type: String, description: 'End date (YYYY-MM-DD)' })
	@ApiQuery({ name: 'unit', required: false, enum: ['day', 'month'], description: 'Grouping unit for charts' })
	async getUserOverview(
		@Req() request: Request,
		@Query('from') from?: string,
		@Query('to') to?: string,
		@Query('unit') unit: 'day' | 'month' = 'month',
	) {
		const userPayload: TokenPayload = await request['user']
		return this.analyticsService.userOverview(userPayload.sub, userPayload.role, from, to, unit);
	}
}