import { Expose } from 'class-transformer'

export class JobStatusResponseDto {
	@Expose()
	id: string

	@Expose()
	displayName: string

	@Expose()
	thumbnailUrl?: string

	@Expose()
	hexColor: string

	@Expose()
	order: number

	@Expose()
	code: string

	@Expose()
	icon?: string

	@Expose()
	nextStatusOrder?: number

	@Expose()
	prevStatusOrder?: number

	@Expose()
	createdAt: Date

	@Expose()
	updatedAt: Date
}
