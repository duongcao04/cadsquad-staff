import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  Body,
  Query,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { GalleryService } from './gallery.service'
import { UploadGalleryDto } from './dto/upload-gallery.dto'

@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) { }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadGalleryDto,
    @Query('userId') userId: string,
  ) {
    return this.galleryService.upload(file, userId, dto)
  }

  @Get()
  async findAll(@Query('userId') userId: string) {
    return this.galleryService.findAll(userId)
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Query('publicId') publicId?: string) {
    return this.galleryService.delete(id, publicId)
  }
}
