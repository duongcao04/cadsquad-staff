import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, UseGuards } from '@nestjs/common'
import { JobTypeService } from './job-type.service'
import { CreateJobTypeDto } from './dto/create-job-type.dto'
import { UpdateJobTypeDto } from './dto/update-job-type.dto'
import { ResponseMessage } from '../../common/decorators/responseMessage.decorator'
import { JwtGuard } from '../auth/jwt.guard'
import { AdminGuard } from '../auth/admin.guard'

@Controller('job-types')
export class JobTypeController {
  constructor(private readonly jobTypeService: JobTypeService) { }

  @Post()
  @HttpCode(201)
  @ResponseMessage('Insert new job type successfully')
  @UseGuards(JwtGuard, AdminGuard)
  async create(@Body() createJobTypeDto: CreateJobTypeDto) {
    return this.jobTypeService.create(createJobTypeDto)
  }

  @Get()
  @HttpCode(200)
  @ResponseMessage('Get list of job type successfully')
  @UseGuards(JwtGuard)
  async findAll() {
    return this.jobTypeService.findAll()
  }

  @Get(':id')
  @HttpCode(200)
  @ResponseMessage('Get job type detail successfully')
  @UseGuards(JwtGuard)
  async findOne(@Param('id') id: string) {
    return this.jobTypeService.findById(id)
  }

  @Patch(':id')
  @HttpCode(200)
  @ResponseMessage('Update job type successfully')
  @UseGuards(JwtGuard, AdminGuard)
  async update(@Param('id') id: string, @Body() updateJobTypeDto: UpdateJobTypeDto) {
    return this.jobTypeService.update(id, updateJobTypeDto)
  }

  @Delete(':id')
  @HttpCode(200)
  @ResponseMessage('Update job type successfully')
  @UseGuards(JwtGuard, AdminGuard)
  async remove(@Param('id') id: string) {
    return this.jobTypeService.delete(id)
  }
}
