import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { AdminGuard } from '../auth/admin.guard'
import { ResponseMessage } from '../../common/decorators/responseMessage.decorator'
import { JwtGuard } from '../auth/jwt.guard'
import { CreateJobTitleDto } from './dto/create-job-title.dto'
import { JobTitleResponseDto } from './dto/job-title-response.dto'
import { UpdateJobTitleDto } from './dto/update-job-title.dto'
import { JobTitleService } from './job-title.service'

@ApiTags('Job Titles')
@Controller('job-titles')
export class JobTitleController {
  constructor(private readonly jobTitleService: JobTitleService) { }

  @Post()
  @HttpCode(201)
  @ResponseMessage('Insert new job title successfully')
  @UseGuards(JwtGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new job title' })
  @ApiResponse({
    status: 201,
    description: 'The job title has been successfully created.',
    type: JobTitleResponseDto,
  })
  async create(@Body() createJobTitleDto: CreateJobTitleDto) {
    return this.jobTitleService.create(createJobTitleDto)
  }

  @Get()
  @HttpCode(200)
  @ResponseMessage('Get list of job titles successfully')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all job titles' })
  @ApiResponse({
    status: 200,
    description: 'Return a list of job titles.',
    type: [JobTitleResponseDto],
  })
  async findAll() {
    return this.jobTitleService.findAll()
  }

  @Get(':id')
  @HttpCode(200)
  @ResponseMessage('Get job title detail successfully')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a job title by its ID' })
  @ApiResponse({
    status: 200,
    description: 'Return a single job title.',
    type: JobTitleResponseDto,
  })
  async findOne(@Param('id') id: string) {
    return this.jobTitleService.findById(id)
  }

  @Patch(':id')
  @HttpCode(200)
  @ResponseMessage('Update job title successfully')
  @UseGuards(JwtGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a job title' })
  @ApiResponse({
    status: 200,
    description: 'The job title has been successfully updated.',
    type: JobTitleResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateJobTitleDto: UpdateJobTitleDto,
  ) {
    return this.jobTitleService.update(id, updateJobTitleDto)
  }

  @Delete(':id')
  @HttpCode(200)
  @ResponseMessage('Delete job title successfully')
  @UseGuards(JwtGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a job title' })
  @ApiResponse({
    status: 200,
    description: 'The job title has been successfully deleted.',
  })
  async remove(@Param('id') id: string) {
    return this.jobTitleService.delete(id)
  }
}
