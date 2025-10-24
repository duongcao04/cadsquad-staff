import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary'
import * as streamifier from 'streamifier'

@Injectable()
export class CloudinaryService {
	constructor() { }
	private readonly logger = new Logger(CloudinaryService.name)

	/**
	 * Upload a file buffer to Cloudinary.
	 * Supports image/video/raw files automatically.
	 */
	async uploadFile(file: Express.Multer.File, folder = '.temp'): Promise<UploadApiResponse> {
		if (!file) throw new BadRequestException('No file uploaded')

		try {
			return new Promise((resolve, reject) => {
				const uploadStream = cloudinary.uploader.upload_stream(
					{
						folder: process.env.CLOUDINARY_FOLDER_ROOT + '/' + folder,
						resource_type: 'auto',
					},
					(error, result) => {
						if (error) return reject(error)
						resolve(result as UploadApiResponse)
					},
				)

				streamifier.createReadStream(file.buffer).pipe(uploadStream)
			})
		} catch (error) {
			this.logger.error(error)
			throw new BadRequestException('No file uploaded')
		}
	}

	/**
	 * Delete a file from Cloudinary using its publicId.
	 */
	async deleteFile(publicId: string): Promise<{ result: string }> {
		if (!publicId) throw new BadRequestException('publicId is required')
		return cloudinary.uploader.destroy(publicId)
	}

	/**
	 * Get Cloudinary URL with optional transformations.
	 */
	generateUrl(publicId: string, options?: object): string {
		return cloudinary.url(publicId, {
			secure: true,
			transformation: [{ quality: 'auto', fetch_format: 'auto' }, ...(options ? [options] : [])],
		})
	}
}
