import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, Req, Query } from '@nestjs/common'
import { JobService } from './job.service'
import { CreateJobDto } from './dto/create-job.dto'
import { AuthGuard } from '../auth/auth.guard'
import { ResponseMessage } from '../../common/decorators/responseMessage.decorator'
import { ChangeStatusDto } from './dto/change-status.dto'
import { ActivityLogService } from './activity-log.service'
import { UpdateJobMembersDto } from './dto/update-job-members.dto'
import { JobQueryDto } from './dto/job-query.dto'
import { TokenPayload } from '../auth/dto/token-payload.dto'

@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService, private readonly activityLogService: ActivityLogService) { }

  @Post()
  @HttpCode(201)
  @ResponseMessage('Insert new job successfully')
  @UseGuards(AuthGuard)
  async create(@Body() createJobDto: CreateJobDto) {
    return this.jobService.create(createJobDto)
  }

  @Get()
  @HttpCode(200)
  @ResponseMessage('Get list of job successfully')
  @UseGuards(AuthGuard)
  async findAll(@Req() request: Request, @Query() query: JobQueryDto) {
    const userPayload: TokenPayload = await request['user']
    if (query.jobNo) {
      return this.jobService.findByJobNo(userPayload.sub, query.jobNo)
    }
    return this.jobService.findAll(userPayload.sub, query)
  }

  @Get(':id')
  @HttpCode(200)
  @ResponseMessage('Get job detail successfully')
  async findOne(@Param('id') id: string) {
    return this.jobService.findById(id)
  }

  @Get(':id/activity-log')
  @HttpCode(200)
  @ResponseMessage('Get job log successfully')
  async getJobActivityLog(@Param('id') id: string) {
    return this.activityLogService.findByJobId(id)
  }

  // @Patch(':id')
  // async update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
  //   return this.jobService.update(id, updateJobDto)
  // }
  @Patch(':id/change-status')
  @HttpCode(200)
  @ResponseMessage('Change job status successfully')
  @UseGuards(AuthGuard)
  async changeStatus(@Req() request: Request, @Param('id') id: string, @Body() data: ChangeStatusDto) {
    const userPayload: TokenPayload = await request['user']
    return this.jobService.changeStatus(id, userPayload.sub, data)
  }

  @Patch(':id/assign-member')
  @HttpCode(200)
  @ResponseMessage('Update job assignee successfully')
  @UseGuards(AuthGuard)
  async assignMember(@Req() request: Request, @Param('id') id: string, @Body() data: UpdateJobMembersDto) {
    const userPayload: TokenPayload = await request['user']
    return this.jobService.updateMembers(id, userPayload.sub, data)
  }

  @Delete(':id')
  @HttpCode(200)
  @ResponseMessage('Delete job successfully')
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: string) {
    return this.jobService.delete(id)
  }
}
