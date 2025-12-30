import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Patch,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common'
import {
    ApiBearerAuth,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger'
import { RoleEnum } from '@prisma/client'

import { ResponseMessage } from '../../common/decorators/responseMessage.decorator'
import { AdminGuard } from '../auth/admin.guard'
import { TokenPayload } from '../auth/dto/token-payload.dto'
import { JwtGuard } from '../auth/jwt.guard'
import { RolesGuard } from '../auth/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'

import { JobService } from './job.service'
import { JobTypeService } from '../job-type/job-type.service'
import { ActivityLogService } from './activity-log.service'

import { CreateJobDto } from './dto/create-job.dto'
import { UpdateJobDto } from './dto/update-job.dto'
import { JobQueryDto } from './dto/job-query.dto'
import { JobResponseDto } from './dto/job-response.dto'
import { DeliverJobDto } from './dto/deliver-job.dto'
import { ChangeStatusDto } from './dto/change-status.dto'
import { BulkChangeStatusDto } from './dto/bulk-change-status.dto'
import { UpdateJobMembersDto } from './dto/update-job-members.dto'
import { RescheduleJobDto } from './dto/reschedule-job.dto'
import { UpdateRevenueDto } from './dto/update-revenue.dto'
import { AssignMemberDto, UpdateAssignmentDto } from './dto/assign-member.dto'

@ApiTags('Jobs')
@Controller('jobs')
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class JobController {
    constructor(
        private readonly jobService: JobService,
        private readonly jobTypeService: JobTypeService,
        private readonly activityLogService: ActivityLogService
    ) {}

    // -------------------------------------------------------------------------
    // READ OPERATIONS
    // -------------------------------------------------------------------------

    @Get(':id/deliveries')
    @UseGuards(JwtGuard) // Staff and Admins might need to see this
    @ResponseMessage('Get job deliveries successfully')
    @ApiOperation({ summary: 'Get all delivery attempts for a specific job' })
    async getJobDeliveries(@Param('id') id: string) {
        return this.jobService.getJobDeliveries(id)
    }

    @Get()
    @ApiOperation({ summary: 'Get list of jobs with pagination' })
    async findAll(@Req() request: Request, @Query() query: JobQueryDto) {
        const user: TokenPayload = request['user']
        return this.jobService.findAll(user.sub, user.role as RoleEnum, query)
    }

    @Get('workbench')
    @ApiOperation({ summary: 'Get workbench data (including pins)' })
    async getWorkbenchData(
        @Req() request: Request,
        @Query() query: JobQueryDto
    ) {
        const user: TokenPayload = request['user']
        return this.jobService.getWorkbenchData(
            user.sub,
            user.role as RoleEnum,
            query
        )
    }

    @Get('no/:jobNo')
    @ApiOperation({ summary: 'Get a job by its job number' })
    async findByNo(@Req() request: Request, @Param('jobNo') jobNo: string) {
        const user: TokenPayload = request['user']
        return this.jobService.findByJobNo(
            user.sub,
            user.role as RoleEnum,
            jobNo
        )
    }

    @Get('due-at/:isoDate')
    @ApiOperation({ summary: 'Get jobs by deadline date' })
    async findJobsDueAt(
        @Req() request: Request,
        @Param('isoDate') isoDate: string
    ) {
        const user: TokenPayload = request['user']
        return this.jobService.findJobsDueAt(
            user.sub,
            user.role as RoleEnum,
            isoDate
        )
    }

    @Get('due-monthly')
    async getDueInMonth(
        @Query('month') month: string,
        @Query('year') year: string,
        @Req() request: Request
    ) {
        const user: TokenPayload = request['user']
        return this.jobService.getDueInMonth(
            Number(month),
            Number(year),
            user.sub,
            user.role as RoleEnum
        )
    }

    @Get('pending-deliver')
    async getPendingDeliver(@Req() request: Request) {
        const user: TokenPayload = request['user']
        return this.jobService.getPendingDeliverJobs(
            user.sub,
            user.role as RoleEnum
        )
    }

    @Get('pending-payouts')
    @UseGuards(RolesGuard)
    @Roles('ADMIN', 'ACCOUNTING')
    async getPendingPayouts() {
        return this.jobService.getPendingPaymentJobs()
    }

    // -------------------------------------------------------------------------
    // CREATE / ACTION OPERATIONS
    // -------------------------------------------------------------------------

    @Post()
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    @ResponseMessage('The job has been successfully created.')
    async create(@Req() request: Request, @Body() createJobDto: CreateJobDto) {
        const user: TokenPayload = request['user']
        return this.jobService.create(user.sub, createJobDto)
    }

    @Post(':id/toggle-pin')
    async togglePin(@Req() request: Request, @Param('id') jobId: string) {
        const user: TokenPayload = request['user']
        return this.jobService.togglePin(user.sub, jobId)
    }

    @Post(':id/deliver')
    async deliverJob(
        @Req() request: Request,
        @Param('id') id: string,
        @Body() data: DeliverJobDto
    ) {
        const user: TokenPayload = request['user']
        return this.jobService.deliverJob(user.sub, id, data)
    }

    @Post('deliver/:deliveryId/:action')
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    async reviewDeliver(
        @Req() request: Request,
        @Param('deliveryId') deliveryId: string,
        @Param('action') action: string,
        @Body() data: { feedback?: string }
    ) {
        const user: TokenPayload = request['user']
        if (action !== 'approve' && action !== 'reject') {
            throw new BadRequestException('Action must be approve or reject')
        }
        return this.jobService.reviewDeliveryActions(
            user.sub,
            deliveryId,
            action === 'approve',
            data.feedback
        )
    }

    @Post(':id/mark-paid')
    @UseGuards(RolesGuard)
    @Roles('ADMIN', 'ACCOUNTING')
    async markPaid(@Req() request: Request, @Param('id') id: string) {
        const user: TokenPayload = request['user']
        return this.jobService.markPaid(id, user.sub)
    }

    // -------------------------------------------------------------------------
    // UPDATE / PATCH OPERATIONS
    // -------------------------------------------------------------------------

    @Patch(':id/assign')
    @UseGuards(JwtGuard, AdminGuard)
    @ResponseMessage('Member assigned successfully')
    async assignMember(
        @Req() request: Request,
        @Param('id') id: string,
        @Body() dto: AssignMemberDto
    ) {
        const user: TokenPayload = request['user']
        // req.user.id is the admin/manager performing the action
        return this.jobService.assignMember(user.sub, id, dto)
    }

    @Patch(':id/assignments/:memberId')
    @UseGuards(JwtGuard, AdminGuard)
    @ResponseMessage('Assignment cost updated')
    async updateAssignment(
        @Req() request: Request,
        @Param('id') jobId: string,
        @Param('memberId') memberId: string,
        @Body() dto: UpdateAssignmentDto
    ) {
        const user: TokenPayload = request['user']
        return this.jobService.updateAssignmentCost(
            user.sub,
            jobId,
            memberId,
            dto
        )
    }

    @Delete(':id/assignments/:memberId')
    @UseGuards(JwtGuard, AdminGuard)
    @ResponseMessage('Member unassigned successfully')
    async unassignMember(
        @Req() request: Request,
        @Param('id') jobId: string,
        @Param('memberId') memberId: string
    ) {
        const user: TokenPayload = request['user']
        return this.jobService.removeMember(user.sub, jobId, memberId)
    }

    @Patch(':id/update-revenue')
    @UseGuards(AdminGuard)
    async updateRevenue(
        @Req() request: Request,
        @Param('id') id: string,
        @Body() updateRevenueDto: UpdateRevenueDto
    ) {
        const user: TokenPayload = request['user']
        return this.jobService.updateRevenue(user.sub, id, updateRevenueDto)
    }

    @Patch(':id')
    @UseGuards(AdminGuard)
    async update(
        @Req() request: Request,
        @Param('id') id: string,
        @Body() updateJobDto: UpdateJobDto
    ) {
        const user: TokenPayload = request['user']
        return this.jobService.update(user.sub, id, updateJobDto)
    }

    @Patch(':id/change-status')
    async changeStatus(
        @Req() request: Request,
        @Param('id') id: string,
        @Body() data: ChangeStatusDto
    ) {
        const user: TokenPayload = request['user']
        return this.jobService.changeStatus(id, user.sub, data)
    }

    // -------------------------------------------------------------------------
    // ADMIN UTILS
    // -------------------------------------------------------------------------

    @Get('next-no')
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    async getNextNo(@Query('typeId') typeId: string) {
        return this.jobTypeService.getNextJobNo(typeId)
    }

    @Delete(':id')
    @UseGuards(AdminGuard)
    async remove(@Req() request: Request, @Param('id') id: string) {
        const user: TokenPayload = request['user']
        return this.jobService.delete(id, user.sub)
    }
}
