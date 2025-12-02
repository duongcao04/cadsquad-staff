import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseGuards,
  Req,
} from '@nestjs/common'
import { CommentService } from './comment.service'
import { CreateCommentDto } from './dto/create-comment.dto'
import { UpdateCommentDto } from './dto/update-comment.dto'
import { JwtGuard } from '../auth/jwt.guard'
import { ResponseMessage } from '../../common/decorators/responseMessage.decorator'
import { TokenPayload } from '../auth/dto/token-payload.dto'

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  @Post()
  @HttpCode(201)
  @ResponseMessage('Insert new comment successfully')
  @UseGuards(JwtGuard)
  async create(@Req() request: Request, @Body() createCommentDto: CreateCommentDto) {
    const userPayload: TokenPayload = await request['user']
    return this.commentService.create(userPayload.sub, createCommentDto)
  }

  @Get('job/:jobId')
  @HttpCode(200)
  @ResponseMessage('Get list of comments for job successfully')
  async findAllByJob(@Param('jobId') jobId: string) {
    return this.commentService.findAllByJob(jobId)
  }

  @Get(':id')
  @HttpCode(200)
  @ResponseMessage('Get comment detail successfully')
  async findOne(@Param('id') id: string) {
    return this.commentService.findById(id)
  }

  @Patch(':id')
  @HttpCode(200)
  @ResponseMessage('Update comment successfully')
  @UseGuards(JwtGuard)
  async update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(id, updateCommentDto)
  }

  @Delete(':id')
  @HttpCode(200)
  @ResponseMessage('Delete comment successfully')
  @UseGuards(JwtGuard)
  async remove(@Param('id') id: string) {
    return this.commentService.delete(id)
  }
}
