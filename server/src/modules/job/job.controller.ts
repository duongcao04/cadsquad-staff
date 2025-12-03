import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common'
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
import { RescheduleJobDto } from './dto/reschedule-job.dto'
import { UpdateJobMembersDto } from './dto/update-job-members.dto'
import { UpdateJobDto } from './dto/update-job.dto'
import { JobService } from './job.service'

@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService, private readonly activityLogService: ActivityLogService) { }

  @Post()
  @HttpCode(201)
  @ResponseMessage('Insert new job successfully')
  @UseGuards(JwtGuard, AdminGuard)
  async create(@Body() createJobDto: CreateJobDto) {
    return this.jobService.create(createJobDto)
  }

  @Get()
  @HttpCode(200)
  @ResponseMessage('Get list of job successfully')
  @UseGuards(JwtGuard)
  async findAll(@Req() request: Request, @Query() query: JobQueryDto) {
    const userPayload: TokenPayload = await request['user']
    return this.jobService.findAll(userPayload.sub, userPayload.role, query)
  }

  @Get('search')
  @HttpCode(200)
  @ResponseMessage('Get jobs by search successfully')
  @UseGuards(JwtGuard)
  async searchJob(@Req() request: Request, @Query() query: { keywords?: string }) {
    const userPayload: TokenPayload = await request['user']
    return this.jobService.findAllNoPaginate(userPayload.sub, userPayload.role, query)
  }

  @Get('deadline/:isoDate')
  @HttpCode(200)
  @UseGuards(JwtGuard)
  @ResponseMessage('Get jobs by deadline successfully')
  async findJobDeadline(@Req() request: Request, @Param('isoDate') isoDate: string) {
    const userPayload: TokenPayload = await request['user']
    return this.jobService.findJobDeadline(userPayload.sub, userPayload.role, isoDate)
  }

  @Get("no/:jobNo")
  @HttpCode(200)
  @ResponseMessage('Get job by no successfully')
  @UseGuards(JwtGuard)
  async findByNo(@Req() request: Request, @Param('jobNo') jobNo: string) {
    const userPayload: TokenPayload = await request['user']
    return this.jobService.findByJobNo(userPayload.sub, userPayload.role, jobNo)
  }

  @Get('columns')
  @HttpCode(200)
  @ResponseMessage('Get columns successfully')
  @UseGuards(JwtGuard)
  async getColumns(@Req() request: Request) {
    const userPayload: TokenPayload = await request['user']
    return this.jobService.getColumns(userPayload.sub)
  }

  @Get('dueOn/:inputDate')
  @HttpCode(200)
  @ResponseMessage('Get job due on today successfully')
  @UseGuards(JwtGuard)
  async getJobsDueOnDate(
    @Req() request: Request,
    @Param() params: GetJobsDueDto,
  ) {
    const userPayload: TokenPayload = request['user'];
    const { inputDate } = params;
    return this.jobService.getJobsDueOnDate(userPayload.sub, userPayload.role, inputDate);
  }

  @Get(':id')
  @HttpCode(200)
  @ResponseMessage('Get job detail by ID successfully')
  @UseGuards(JwtGuard, AdminGuard)
  async findOne(@Param('id') id: string) {
    return this.jobService.findById(id)
  }

  @Get(':id/activity-log')
  @HttpCode(200)
  @ResponseMessage('Get job log successfully')
  @UseGuards(JwtGuard)
  async getJobActivityLog(@Param('id') id: string) {
    return this.activityLogService.findByJobId(id)
  }
  @Get(':id/assignees')
  @HttpCode(200)
  @ResponseMessage('Get assignees successfully')
  @UseGuards(JwtGuard)
  async getAssignees(@Param('id') id: string) {
    return this.jobService.getAssignee(id)
  }

  @Patch(':id')
  @HttpCode(200)
  @ResponseMessage('Update job successfully')
  @UseGuards(JwtGuard, AdminGuard)
  async update(@Req() request: Request, @Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    const userPayload: TokenPayload = await request['user']
    return this.jobService.update(userPayload.sub, id, updateJobDto)
  }

  @Patch(':id/change-status')
  @HttpCode(200)
  @ResponseMessage('Change job status successfully')
  @UseGuards(JwtGuard)
  async changeStatus(@Req() request: Request, @Param('id') id: string, @Body() data: ChangeStatusDto) {
    const userPayload: TokenPayload = await request['user']
    return this.jobService.changeStatus(id, userPayload.sub, data)
  }

  @Patch(':id/reschedule')
  @HttpCode(200)
  @ResponseMessage('Reschedule job successfully')
  @UseGuards(JwtGuard)
  async rescheduleJob(@Req() request: Request, @Param('id') id: string, @Body() data: RescheduleJobDto) {
    const userPayload: TokenPayload = await request['user']
    return this.jobService.rescheduleJob(id, userPayload.sub, data)
  }

  @Patch(':id/mark-paid')
  @HttpCode(200)
  @ResponseMessage('Mark as paid job successfully')
  @UseGuards(AdminGuard, JwtGuard)
  async markPaid(@Req() request: Request, @Param('id') id: string, @Body() data: RescheduleJobDto) {
    const userPayload: TokenPayload = await request['user']
    return this.jobService.markPaid(id, userPayload.sub)
  }

  @Post('bulk/change-status')
  @HttpCode(200)
  @ResponseMessage('Bulk change status successfully')
  @UseGuards(JwtGuard)
  async bulkChangeStatus(@Req() request: Request, @Body() data: BulkChangeStatusDto) {
    const userPayload: TokenPayload = await request['user']
    return this.jobService.bulkChangeStatus(userPayload.sub, data)
  }

  @Patch(':id/assign-member')
  @HttpCode(200)
  @ResponseMessage('Update job assignee successfully')
  @UseGuards(JwtGuard, AdminGuard)
  async assignMember(@Req() request: Request, @Param('id') id: string, @Body() data: UpdateJobMembersDto) {
    const userPayload: TokenPayload = await request['user']
    return this.jobService.updateMembers(id, userPayload.sub, data)
  }

  @Patch(':id/member/:memberId/remove')
  @HttpCode(200)
  @ResponseMessage('Remove member successfully')
  @UseGuards(JwtGuard, AdminGuard)
  async removeMember(@Req() request: Request, @Param('id') id: string, @Param('memberId') memberId: string) {
    const userPayload: TokenPayload = await request['user']
    return this.jobService.removeMember(id, userPayload.sub, memberId)
  }

  @Delete(':id')
  @HttpCode(200)
  @ResponseMessage('Delete job successfully')
  @UseGuards(JwtGuard, AdminGuard)
  async remove(@Param('id') id: string) {
    return this.jobService.delete(id)
  }
}
