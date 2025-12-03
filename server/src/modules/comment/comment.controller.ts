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
import { ResponseMessage } from '../../common/decorators/responseMessage.decorator'
import { JwtGuard } from '../auth/jwt.guard'
import { TokenPayload } from '../auth/dto/token-payload.dto'
import { CommentService } from './comment.service'
import { CommentResponseDto } from './dto/comment-response.dto'
import { CreateCommentDto } from './dto/create-comment.dto'
import { UpdateCommentDto } from './dto/update-comment.dto'

@ApiTags('Comments')
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  @Post()
  @HttpCode(201)
  @ResponseMessage('Insert new comment successfully')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiResponse({
    status: 201,
    description: 'The comment has been successfully created.',
    type: CommentResponseDto,
  })
  async create(
    @Req() request: Request,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    const userPayload: TokenPayload = await request['user']
    return this.commentService.create(userPayload.sub, createCommentDto)
  }

  @Get('job/:jobId')
  @HttpCode(200)
  @ResponseMessage('Get list of comments for job successfully')
  @ApiOperation({ summary: 'Get all comments for a specific job' })
  @ApiResponse({
    status: 200,
    description: 'Return a list of comments.',
    type: [CommentResponseDto],
  })
  async findAllByJob(@Param('jobId') jobId: string) {
    return this.commentService.findAllByJob(jobId)
  }

  @Get(':id')
  @HttpCode(200)
  @ResponseMessage('Get comment detail successfully')
  @ApiOperation({ summary: 'Get a comment by its ID' })
  @ApiResponse({
    status: 200,
    description: 'Return a single comment.',
    type: CommentResponseDto,
  })
  async findOne(@Param('id') id: string) {
    return this.commentService.findById(id)
  }

  @Patch(':id')
  @HttpCode(200)
  @ResponseMessage('Update comment successfully')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a comment' })
  @ApiResponse({
    status: 200,
    description: 'The comment has been successfully updated.',
    type: CommentResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentService.update(id, updateCommentDto)
  }

  @Delete(':id')
  @HttpCode(200)
  @ResponseMessage('Delete comment successfully')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiResponse({
    status: 200,
    description: 'The comment has been successfully deleted.',
  })
  async remove(@Param('id') id: string) {
    return this.commentService.delete(id)
  }
}
