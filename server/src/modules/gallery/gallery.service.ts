import { Injectable } from '@nestjs/common'
import { UploadGalleryDto } from './dto/upload-gallery.dto'
import { plainToInstance } from 'class-transformer'
import { GalleryResponseDto } from './dto/gallery-response.dto'
import { PrismaService } from '../../providers/prisma/prisma.service'
import { CloudinaryService } from '../../providers/cloudinary/cloudinary.service'

@Injectable()
export class GalleryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) { }

  async upload(file: Express.Multer.File, userId: string, dto: UploadGalleryDto) {
    const uploadResult = await this.cloudinary.uploadFile(file, dto.folder || 'user_gallery')

    const newGallery = await this.prisma.gallery.create({
      data: {
        title: dto.title || uploadResult.original_filename,
        description: dto.description,
        url: uploadResult.secure_url,
        userId,
      },
    })

    return plainToInstance(GalleryResponseDto, newGallery, {
      excludeExtraneousValues: true,
    })
  }

  async findAll(userId: string) {
    const galleries = await this.prisma.gallery.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })

    return plainToInstance(GalleryResponseDto, galleries, {
      excludeExtraneousValues: true,
    })
  }

  async delete(id: string, publicId?: string) {
    if (publicId) await this.cloudinary.deleteFile(publicId)
    return this.prisma.gallery.delete({ where: { id } })
  }
}
