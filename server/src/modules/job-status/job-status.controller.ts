import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode } from '@nestjs/common'
import { JobStatusService } from './job-status.service'
import { CreateJobStatusDto } from './dto/create-job-status.dto'
import { UpdateJobStatusDto } from './dto/update-job-status.dto'
import { JwtGuard } from '../auth/jwt.guard'
import { ResponseMessage } from '../../common/decorators/responseMessage.decorator'

@Controller('job-statuses')
export class JobStatusController {
  constructor(private readonly jobStatusService: JobStatusService) { }

  @Post()
  @HttpCode(201)
  @ResponseMessage('Insert new job status successfully')
  @UseGuards(JwtGuard)
  async create(@Body() createJobStatusDto: CreateJobStatusDto) {
    return this.jobStatusService.create(createJobStatusDto)
  }

  @Get()
  @HttpCode(200)
  @ResponseMessage('Get list of job status successfully')
  async findAll() {
    return this.jobStatusService.findAll()
  }

  @Get('/order/:orderNum')
  @HttpCode(200)
  @ResponseMessage('Get job status detail successfully')
  async findByOrder(@Param('orderNum') orderNum: string) {
    return this.jobStatusService.findByOrder(parseInt(orderNum))
  }

  @Get(':id')
  @HttpCode(200)
  @ResponseMessage('Get job status detail successfully')
  async findOne(@Param('id') id: string) {
    return this.jobStatusService.findById(id)
  }

  @Patch(':id')
  @HttpCode(200)
  @ResponseMessage('Update job status successfully')
  @UseGuards(JwtGuard)
  async update(@Param('id') id: string, @Body() updateJobStatusDto: UpdateJobStatusDto) {
    return this.jobStatusService.update(id, updateJobStatusDto)
  }

  @Delete(':id')
  @HttpCode(200)
  @ResponseMessage('Update job status successfully')
  @UseGuards(JwtGuard)
  async remove(@Param('id') id: string) {
    return this.jobStatusService.delete(id)
  }
}
