import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

export class JobStatusResponseDto {
	@ApiProperty({ description: 'Job Status ID' })
	@Expose()
	id: string

	@ApiProperty({ description: 'Display name of the job status' })
	@Expose()
	displayName: string

	@ApiProperty({ description: 'URL of the thumbnail', required: false })
	@Expose()
	thumbnailUrl?: string

	@ApiProperty({ description: 'Hex color of the job status' })
	@Expose()
	hexColor: string

	@ApiProperty({ description: 'Order of the job status' })
	@Expose()
	order: number

	@ApiProperty({ description: 'Code of the job status' })
	@Expose()
	code: string

	@ApiProperty({ description: 'Icon of the job status', required: false })
	@Expose()
	icon?: string

	@ApiProperty({ description: 'Order of the next status', required: false })
	@Expose()
	nextStatusOrder?: number

	@ApiProperty({ description: 'Order of the previous status', required: false })
	@Expose()
	prevStatusOrder?: number

	@ApiProperty({ description: 'Creation timestamp' })
	@Expose()
	createdAt: Date

	@ApiProperty({ description: 'Last update timestamp' })
	@Expose()
	updatedAt: Date
}
