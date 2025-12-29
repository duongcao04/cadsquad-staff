import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
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
import { TokenPayload } from '../auth/dto/token-payload.dto'
import { JwtGuard } from '../auth/jwt.guard'
import { JobResponseDto } from '../job/dto/job-response.dto'
import { CreateJobStatusDto } from './dto/create-job-status.dto'
import { JobStatusResponseDto } from './dto/job-status-response.dto'
import { UpdateJobStatusDto } from './dto/update-job-status.dto'
import { JobStatusService } from './job-status.service'

@ApiTags('Job Statuses')
@Controller('job-statuses')
export class JobStatusController {
  constructor(private readonly jobStatusService: JobStatusService) { }

  @Post()
  @HttpCode(201)
  @ResponseMessage('Insert new job status successfully')
  @UseGuards(JwtGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new job status' })
  @ApiResponse({
    status: 201,
    description: 'The job status has been successfully created.',
    type: JobStatusResponseDto,
  })
  async create(@Body() createJobStatusDto: CreateJobStatusDto) {
    return this.jobStatusService.create(createJobStatusDto)
  }

  @Get()
  @HttpCode(200)
  @ResponseMessage('Get list of job status successfully')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all job statuses' })
  @ApiResponse({
    status: 200,
    description: 'Return a list of job statuses.',
    type: [JobStatusResponseDto],
  })
  async findAll() {
    return this.jobStatusService.findAll()
  }

  @Get('/order/:orderNum')
  @HttpCode(200)
  @ResponseMessage('Get job status detail successfully')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a job status by its order number' })
  @ApiResponse({
    status: 200,
    description: 'Return a single job status.',
    type: JobStatusResponseDto,
  })
  async findByOrder(@Param('orderNum') orderNum: string) {
    return this.jobStatusService.findByOrder(parseInt(orderNum))
  }

  @Get('/code/:statusCode/jobs')
  @HttpCode(200)
  @ResponseMessage('Get jobs by status code successfully')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all jobs with a specific status code' })
  @ApiResponse({
    status: 200,
    description: 'Return a list of jobs.',
    type: [JobResponseDto],
  })
  async findJobsByStatusCode(
    @Req() request: Request,
    @Param('statusCode') statusCode: string,
  ) {
    const userPayload: TokenPayload = await request['user']
    return this.jobStatusService.findJobsByStatusCode(
      userPayload.sub,
      userPayload.role,
      statusCode,
    )
  }

  @Get(':id')
  @HttpCode(200)
  @ResponseMessage('Get job status detail successfully')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a job status by its ID' })
  @ApiResponse({
    status: 200,
    description: 'Return a single job status.',
    type: JobStatusResponseDto,
  })
  async findOne(@Param('id') id: string) {
    return this.jobStatusService.findById(id)
  }

  @Patch(':id')
  @HttpCode(200)
  @ResponseMessage('Update job status successfully')
  @UseGuards(JwtGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a job status' })
  @ApiResponse({
    status: 200,
    description: 'The job status has been successfully updated.',
    type: JobStatusResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateJobStatusDto: UpdateJobStatusDto,
  ) {
    return this.jobStatusService.update(id, updateJobStatusDto)
  }

  @Delete(':id')
  @HttpCode(200)
  @ResponseMessage('Update job status successfully')
  @UseGuards(JwtGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a job status' })
  @ApiResponse({
    status: 200,
    description: 'The job status has been successfully deleted.',
  })
  async remove(@Param('id') id: string) {
    return this.jobStatusService.delete(id)
  }
}
