import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../providers/prisma/prisma.service'
import { plainToInstance } from 'class-transformer'
import { CreateCommentDto } from './dto/create-comment.dto'
import { UpdateCommentDto } from './dto/update-comment.dto'
import { CommentResponseDto } from './dto/comment-response.dto'
import { JobComment } from '@prisma/client'

@Injectable()
export class JobCommentService {
  constructor(private readonly prismaService: PrismaService) { }

  async create(userId: string, data: CreateCommentDto): Promise<Comment> {
    const comment = await this.prismaService.jobComment.create({
      data: {
        ...data,
        userId: userId
      }
    })
    return plainToInstance(CommentResponseDto, comment, {
      excludeExtraneousValues: true,
    }) as unknown as Comment
  }

  async findAllByJob(jobId: string): Promise<Comment[]> {
    const comments = await this.prismaService.jobComment.findMany({
      where: { jobId },
      include: {
        job: {},
        user: {},
        replies: {
          include: {
            job: {},
            user: {}
          }
        }
      },
      orderBy: { createdAt: 'asc' },
    })
    return comments.map((c) =>
      plainToInstance(CommentResponseDto, c, { excludeExtraneousValues: true }),
    ) as unknown as Comment[]
  }

  async findById(id: string): Promise<Comment> {
    const comment = await this.prismaService.jobComment.findUnique({ where: { id } })
    if (!comment) throw new NotFoundException('Comment not found')

    return plainToInstance(CommentResponseDto, comment, {
      excludeExtraneousValues: true,
    }) as unknown as Comment
  }

  async update(id: string, data: UpdateCommentDto): Promise<Comment> {
    try {
      const updated = await this.prismaService.jobComment.update({
        where: { id },
        data,
      })
      return plainToInstance(CommentResponseDto, updated, {
        excludeExtraneousValues: true,
      }) as unknown as Comment
    } catch (error) {
      throw new NotFoundException('Comment not found')
    }
  }

  async delete(id: string): Promise<JobComment> {
    try {
      return await this.prismaService.jobComment.delete({ where: { id } })
    } catch (error) {
      throw new NotFoundException('Comment not found')
    }
  }
}
