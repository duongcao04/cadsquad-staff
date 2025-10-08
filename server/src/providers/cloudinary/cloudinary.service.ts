import { Injectable, BadRequestException } from '@nestjs/common'
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary'
import * as streamifier from 'streamifier'

@Injectable()
export class CloudinaryService {
	constructor() {
		cloudinary.config({
			cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
			api_key: process.env.CLOUDINARY_API_KEY,
			api_secret: process.env.CLOUDINARY_API_SECRET,
			secure: true,
		})
	}

	/**
	 * Upload a file buffer to Cloudinary.
	 * Supports image/video/raw files automatically.
	 */
	async uploadFile(file: Express.Multer.File, folder = 'uploads'): Promise<UploadApiResponse> {
		if (!file) throw new BadRequestException('No file uploaded')

		return new Promise((resolve, reject) => {
			const uploadStream = cloudinary.uploader.upload_stream(
				{
					folder,
					resource_type: 'auto',
				},
				(error, result) => {
					if (error) return reject(error)
					resolve(result as UploadApiResponse)
				},
			)

			streamifier.createReadStream(file.buffer).pipe(uploadStream)
		})
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
