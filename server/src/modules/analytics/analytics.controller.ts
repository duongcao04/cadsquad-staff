import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../auth/admin.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('analytics')
@UseGuards(JwtGuard, RolesGuard)
@Roles('ADMIN', 'ACCOUNTING')
export class AnalyticsController {
	constructor(private readonly analyticsService: AnalyticsService) { }

	@Get('revenue')
	async getRevenue(@Query('from') from?: string,
		@Query('to') to?: string,) {
		return this.analyticsService.getRevenueAnalytics(from, to);
	}
}