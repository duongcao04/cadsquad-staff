import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ResponseMessage } from '../../common/decorators/responseMessage.decorator'
import { TokenPayload } from '../auth/dto/token-payload.dto'
import { JwtGuard } from '../auth/jwt.guard'
import { UploadGalleryDto } from './dto/upload-gallery.dto'
import { GalleryService } from './gallery.service'

@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) { }

  @Post('upload')
  @HttpCode(201)
  @ResponseMessage('Upload successfully')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtGuard)
  async upload(@Req() request: Request,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadGalleryDto,
  ) {
    const userPayload: TokenPayload = await request['user']
    return this.galleryService.upload(file, userPayload.sub, dto)
  }

  @Get()
  @HttpCode(200)
  @ResponseMessage('Get gallery successfully')
  @UseGuards(JwtGuard)
  async findAll(@Req() request: Request) {
    const userPayload: TokenPayload = await request['user']
    return this.galleryService.getByUser(userPayload.sub)
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Query('publicId') publicId?: string) {
    return this.galleryService.delete(id, publicId)
  }
}
