import {
    Controller,
    Post,
    Param,
    Delete,
    UseInterceptors,
    UploadedFile,
    UseGuards,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import {
    ApiConsumes,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger'
import { UploadService } from './upload.service'
import { UploadResponseDto } from './dto/upload-response.dto'
import { JwtGuard } from '../auth/jwt.guard'

@ApiTags('Upload')
@Controller('upload')
@UseGuards(JwtGuard)
export class UploadController {
    constructor(private readonly uploadService: UploadService) {}

    @Post('image')
    @UseInterceptors(FileInterceptor('image'))
    @ApiOperation({ summary: 'Upload an image' })
    @ApiConsumes('multipart/form-data')
    @ApiResponse({
        status: 201,
        description: 'The image has been successfully uploaded.',
        type: UploadResponseDto,
    })
    insertImage(@UploadedFile() image: Express.Multer.File) {
        return this.uploadService.insertImage(image)
    }

    @Delete('images/:id')
    @ApiOperation({ summary: 'Delete an image' })
    @ApiResponse({
        status: 200,
        description: 'The image has been successfully deleted.',
    })
    deleteImage(@Param('id') id: string) {
        return this.uploadService.delete(+id)
    }
}
