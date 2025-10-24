import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) { }

  @Post('images')
  @UseInterceptors(FileInterceptor('image'))
  insertImage(@UploadedFile() image: Express.Multer.File) {
    return this.uploadService.insertImage(image);
  }

  @Delete('images/:id')
  deleteImage(@Param('id') id: string) {
    return this.uploadService.delete(+id);
  }
}
