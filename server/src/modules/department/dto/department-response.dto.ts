import { Expose } from 'class-transformer'

export class DepartmentResponseDto {
	@Expose()
	id: string

	@Expose()
	displayName: string

	@Expose()
	notes?: string

	@Expose()
	code: string

	@Expose()
	hexColor?: string

	@Expose()
	createdAt: Date

	@Expose()
	updatedAt: Date
}
