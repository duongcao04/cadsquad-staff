import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../providers/prisma/prisma.service'
import { Config } from '@prisma/client'
import { CreateConfigDto } from './dto/create-config.dto'
import { UpdateConfigDto } from './dto/update-config.dto'

@Injectable()
export class ConfigService {
  constructor(private readonly prisma: PrismaService) { }

  async create(userId: string, data: CreateConfigDto): Promise<Config> {
    return await this.prisma.config.create({ data: { userId, code: data.code, displayName: data.displayName, value: data.value } })
  }

  async findAll(userId: string): Promise<Config[]> {
    return this.prisma.config.findMany({
      where: {
        userId: userId
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findById(userId: string, configId: string): Promise<Config> {
    const config = await this.prisma.config.findUnique({ where: { id: configId, userId } })
    if (!config) throw new NotFoundException('Config not found')
    return config
  }

  async update(userId: string, id: string, data: UpdateConfigDto): Promise<Config> {
    await this.findById(userId, id)
    return this.prisma.config.update({
      where: { id },
      data,
    })
  }

  async delete(userId: string, configId: string): Promise<Config> {
    await this.findById(userId, configId)
    return this.prisma.config.delete({ where: { userId, id: configId } })
  }

  async findByCode(userId: string, code: string): Promise<Config | null> {
    return this.prisma.config.findUnique({ where: { code, userId } })
  }
}
