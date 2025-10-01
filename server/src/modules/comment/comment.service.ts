import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../providers/prisma/prisma.service'
import { Comment } from '@prisma/client'
import { plainToInstance } from 'class-transformer'
import { CreateCommentDto } from './dto/create-comment.dto'
import { UpdateCommentDto } from './dto/update-comment.dto'
import { CommentResponseDto } from './dto/comment-response.dto'

@Injectable()
export class CommentService {
  constructor(private readonly prismaService: PrismaService) { }

  async create(data: CreateCommentDto): Promise<Comment> {
    const comment = await this.prismaService.comment.create({ data })
    return plainToInstance(CommentResponseDto, comment, {
      excludeExtraneousValues: true,
    }) as unknown as Comment
  }

  async findAllByJob(jobId: string): Promise<Comment[]> {
    const comments = await this.prismaService.comment.findMany({
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
    const comment = await this.prismaService.comment.findUnique({ where: { id } })
    if (!comment) throw new NotFoundException('Comment not found')

    return plainToInstance(CommentResponseDto, comment, {
      excludeExtraneousValues: true,
    }) as unknown as Comment
  }

  async update(id: string, data: UpdateCommentDto): Promise<Comment> {
    try {
      const updated = await this.prismaService.comment.update({
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

  async delete(id: string): Promise<Comment> {
    try {
      return await this.prismaService.comment.delete({ where: { id } })
    } catch (error) {
      throw new NotFoundException('Comment not found')
    }
  }
}
