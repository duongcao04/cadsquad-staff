import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode } from '@nestjs/common'
import { JobTitleService } from './job-title.service'
import { CreateJobTitleDto } from './dto/create-job-title.dto'
import { UpdateJobTitleDto } from './dto/update-job-title.dto'
import { JwtGuard } from '../auth/jwt.guard'
import { ResponseMessage } from '../../common/decorators/responseMessage.decorator'

@Controller('job-titles')
export class JobTitleController {
  constructor(private readonly jobTitleService: JobTitleService) { }

  @Post()
  @HttpCode(201)
  @ResponseMessage('Insert new job title successfully')
  @UseGuards(JwtGuard)
  async create(@Body() createJobTitleDto: CreateJobTitleDto) {
    return this.jobTitleService.create(createJobTitleDto)
  }

  @Get()
  @HttpCode(200)
  @ResponseMessage('Get list of job titles successfully')
  async findAll() {
    return this.jobTitleService.findAll()
  }

  @Get(':id')
  @HttpCode(200)
  @ResponseMessage('Get job title detail successfully')
  async findOne(@Param('id') id: string) {
    return this.jobTitleService.findById(id)
  }

  @Patch(':id')
  @HttpCode(200)
  @ResponseMessage('Update job title successfully')
  @UseGuards(JwtGuard)
  async update(@Param('id') id: string, @Body() updateJobTitleDto: UpdateJobTitleDto) {
    return this.jobTitleService.update(id, updateJobTitleDto)
  }

  @Delete(':id')
  @HttpCode(200)
  @ResponseMessage('Delete job title successfully')
  @UseGuards(JwtGuard)
  async remove(@Param('id') id: string) {
    return this.jobTitleService.delete(id)
  }
}
