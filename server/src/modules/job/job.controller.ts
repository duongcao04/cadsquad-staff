import {
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
import { ResponseMessage } from '../../common/decorators/responseMessage.decorator'
import { AdminGuard } from '../auth/admin.guard'
import { TokenPayload } from '../auth/dto/token-payload.dto'
import { JwtGuard } from '../auth/jwt.guard'
import { ActivityLogService } from './activity-log.service'
import { BulkChangeStatusDto } from './dto/bulk-change-status.dto'
import { ChangeStatusDto } from './dto/change-status.dto'
import { CreateJobDto } from './dto/create-job.dto'
import { GetJobsDueDto } from './dto/get-jobs-due.dto'
import { JobQueryDto } from './dto/job-query.dto'
import { JobResponseDto } from './dto/job-response.dto'
import { RescheduleJobDto } from './dto/reschedule-job.dto'
import { UpdateJobMembersDto } from './dto/update-job-members.dto'
import { UpdateJobDto } from './dto/update-job.dto'
import { JobService } from './job.service'
import { RolesGuard } from '../auth/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { JobTypeService } from '../job-type/job-type.service'

@ApiTags('Jobs')
@Controller('jobs')
@UseGuards(JwtGuard)
export class JobController {
    constructor(
        private readonly jobService: JobService,
        private readonly jobTypeService: JobTypeService,
        private readonly activityLogService: ActivityLogService
    ) { }


    @Post(':id/toggle-pin')
    async togglePin(@Req() request: Request, @Param('id') jobId: string) {
        const userPayload: TokenPayload = await request['user']
        return this.jobService.togglePin(userPayload.sub, jobId);
    }

    @Post()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new job' })
    @ApiResponse({
        status: 201,
        description: 'The job has been successfully created.',
        type: JobResponseDto,
    })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @HttpCode(201)
    @ResponseMessage('The job has been successfully created.')
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    async create(@Req() request: Request, @Body() createJobDto: CreateJobDto) {
        const userPayload: TokenPayload = await request['user']
        return this.jobService.create(userPayload.sub, createJobDto)
    }

    @Get('next-no')
    @HttpCode(200)
    @ResponseMessage('Get next job no successfully')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Get next job no successfully',
    })
    @ApiResponse({
        status: 200,
        description: 'Return a next job no (ex: F.0001 )',
    })
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    async getNextNo(@Query('typeId') typeId: string) {
        return this.jobTypeService.getNextJobNo(typeId)
    }

    @Get()
    @HttpCode(200)
    @ResponseMessage('Get list of job successfully')
    @UseGuards(JwtGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Get a list of jobs with pagination, filtering, and sorting',
    })
    @ApiResponse({
        status: 200,
        description: 'Return a list of jobs.',
        type: [JobResponseDto],
    })
    async findAll(@Req() request: Request, @Query() query: JobQueryDto) {
        const userPayload: TokenPayload = await request['user']
        return this.jobService.findAll(userPayload.sub, userPayload.role, query)
    }

    @Get('workbench')
    @HttpCode(200)
    @ResponseMessage('Get workbench data page')
    @UseGuards(JwtGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Get a list of jobs with pagination, filtering, and sorting, pinned job',
    })
    @ApiResponse({
        status: 200,
        description: 'Return a list of jobs.',
        type: [JobResponseDto],
    })
    async getWorkbenchData(@Req() request: Request, @Query() query: JobQueryDto) {
        const userPayload: TokenPayload = await request['user']
        return this.jobService.getWorkbenchData(userPayload.sub, userPayload.role, query)
    }

    @Get('search')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Search for jobs by keywords without pagination' })
    @ApiQuery({ name: 'keywords', type: 'string', required: false })
    @ApiResponse({
        status: 200,
        description: 'Return a list of jobs.',
        type: [JobResponseDto],
    })
    @HttpCode(200)
    @ResponseMessage('Get jobs by search successfully')
    async searchJob(
        @Req() request: Request,
        @Query() query: { keywords?: string }
    ) {
        const userPayload: TokenPayload = await request['user']
        return this.jobService.search(
            userPayload.sub,
            userPayload.role,
            query.keywords
        )
    }

    @Get('due-at/:isoDate')
    @HttpCode(200)
    @UseGuards(JwtGuard)
    @ResponseMessage('Get jobs by deadline successfully')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get jobs by deadline date' })
    @ApiParam({
        name: 'isoDate',
        type: 'string',
        description: 'ISO date string',
    })
    @ApiResponse({
        status: 200,
        description: 'Return a list of jobs.',
        type: [JobResponseDto],
    })
    async findJobsDueAt(
        @Req() request: Request,
        @Param('isoDate') isoDate: string
    ) {
        const userPayload: TokenPayload = await request['user']
        return this.jobService.findJobsDueAt(
            userPayload.sub,
            userPayload.role,
            isoDate
        )
    }

    @Get('pending-deliver')
    async getPendingDeliver(@Req() request: Request) {
        const userPayload: TokenPayload = await request['user']
        return this.jobService.getPendingDeliverJobs(userPayload.sub, userPayload.role);
    }

    @Get('no/:jobNo')
    @HttpCode(200)
    @ResponseMessage('Get job by no successfully')
    @UseGuards(JwtGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get a job by its job number' })
    @ApiParam({ name: 'jobNo', type: 'string' })
    @ApiResponse({
        status: 200,
        description: 'Return a single job.',
        type: JobResponseDto,
    })
    async findByNo(@Req() request: Request, @Param('jobNo') jobNo: string) {
        const userPayload: TokenPayload = await request['user']
        return this.jobService.findByJobNo(
            userPayload.sub,
            userPayload.role,
            jobNo
        )
    }

    @Get(':id')
    @HttpCode(200)
    @ResponseMessage('Get job detail by ID successfully')
    @UseGuards(JwtGuard, AdminGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get a job by its ID' })
    @ApiResponse({
        status: 200,
        description: 'Return a single job.',
        type: JobResponseDto,
    })
    async findOne(@Param('id') id: string) {
        return this.jobService.findById(id)
    }

    @Get(':id/activity-log')
    @HttpCode(200)
    @ResponseMessage('Get job log successfully')
    @UseGuards(JwtGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get activity log for a job' })
    @ApiResponse({
        status: 200,
        description: 'Return a list of activity logs.',
    })
    async getJobActivityLog(@Param('id') id: string) {
        return this.activityLogService.findByJobId(id)
    }
    @Get(':id/assignees')
    @HttpCode(200)
    @ResponseMessage('Get assignees successfully')
    @UseGuards(JwtGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get assignees for a job' })
    @ApiResponse({ status: 200, description: 'Return a list of assignees.' })
    async getAssignees(@Param('id') id: string) {
        return this.jobService.getAssignee(id)
    }

    @Patch(':id')
    @HttpCode(200)
    @ResponseMessage('Update job successfully')
    @UseGuards(JwtGuard, AdminGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update a job' })
    @ApiResponse({
        status: 200,
        description: 'The job has been successfully updated.',
        type: JobResponseDto,
    })
    async update(
        @Req() request: Request,
        @Param('id') id: string,
        @Body() updateJobDto: UpdateJobDto
    ) {
        const userPayload: TokenPayload = await request['user']
        return this.jobService.update(userPayload.sub, id, updateJobDto)
    }

    @Patch(':id/change-status')
    @HttpCode(200)
    @ResponseMessage('Change job status successfully')
    @UseGuards(JwtGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Change the status of a job' })
    @ApiResponse({
        status: 200,
        description: 'The job status has been successfully changed.',
        type: JobResponseDto,
    })
    async changeStatus(
        @Req() request: Request,
        @Param('id') id: string,
        @Body() data: ChangeStatusDto
    ) {
        const userPayload: TokenPayload = await request['user']
        return this.jobService.changeStatus(id, userPayload.sub, data)
    }

    @Patch(':id/reschedule')
    @HttpCode(200)
    @ResponseMessage('Reschedule job successfully')
    @UseGuards(JwtGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Reschedule a job' })
    @ApiResponse({
        status: 200,
        description: 'The job has been successfully rescheduled.',
        type: JobResponseDto,
    })
    async rescheduleJob(
        @Req() request: Request,
        @Param('id') id: string,
        @Body() data: RescheduleJobDto
    ) {
        const userPayload: TokenPayload = await request['user']
        return this.jobService.rescheduleJob(id, userPayload.sub, data)
    }

    @Post(':id/mark-paid')
    @HttpCode(200)
    @ResponseMessage('Mark as paid job successfully')
    @UseGuards(AdminGuard, JwtGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Mark a job as paid' })
    @ApiResponse({
        status: 200,
        description: 'The job has been successfully marked as paid.',
        type: JobResponseDto,
    })
    async markPaid(@Req() request: Request, @Param('id') id: string) {
        const userPayload: TokenPayload = await request['user']
        return this.jobService.markPaid(id, userPayload.sub)
    }

    @Post('bulk/change-status')
    @HttpCode(200)
    @ResponseMessage('Bulk change status successfully')
    @UseGuards(JwtGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Bulk change the status of jobs' })
    @ApiResponse({
        status: 200,
        description: 'The job statuses have been successfully changed.',
    })
    async bulkChangeStatus(
        @Req() request: Request,
        @Body() data: BulkChangeStatusDto
    ) {
        const userPayload: TokenPayload = await request['user']
        return this.jobService.bulkChangeStatus(userPayload.sub, data)
    }

    @Patch(':id/assign-member')
    @HttpCode(200)
    @ResponseMessage('Update job assignee successfully')
    @UseGuards(JwtGuard, AdminGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Assign members to a job' })
    @ApiResponse({
        status: 200,
        description: 'The job members have been successfully updated.',
        type: JobResponseDto,
    })
    async assignMember(
        @Req() request: Request,
        @Param('id') id: string,
        @Body() data: UpdateJobMembersDto
    ) {
        const userPayload: TokenPayload = await request['user']
        return this.jobService.updateMembers(id, userPayload.sub, data)
    }

    @Patch(':id/member/:memberId/remove')
    @HttpCode(200)
    @ResponseMessage('Remove member successfully')
    @UseGuards(JwtGuard, AdminGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Remove a member from a job' })
    @ApiResponse({
        status: 200,
        description: 'The member has been successfully removed.',
        type: JobResponseDto,
    })
    async removeMember(
        @Req() request: Request,
        @Param('id') id: string,
        @Param('memberId') memberId: string
    ) {
        const userPayload: TokenPayload = await request['user']
        return this.jobService.removeMember(id, userPayload.sub, memberId)
    }

    @Delete(':id')
    @HttpCode(200)
    @ResponseMessage('Delete job successfully')
    @UseGuards(JwtGuard, AdminGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete a job' })
    @ApiResponse({
        status: 200,
        description: 'The job has been successfully deleted.',
    })
    async remove(@Param('id') id: string) {
        return this.jobService.delete(id)
    }
}
