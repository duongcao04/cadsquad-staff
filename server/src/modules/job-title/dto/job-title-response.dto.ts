import { Expose } from 'class-transformer'

export class JobTitleResponseDto {
	@Expose()
	id: string

	@Expose()
	displayName: string

	@Expose()
	notes?: string

	@Expose()
	code: string

	@Expose()
	createdAt: Date

	@Expose()
	updatedAt: Date
}
