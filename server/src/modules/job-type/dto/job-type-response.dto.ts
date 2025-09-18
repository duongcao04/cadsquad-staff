import { Expose } from 'class-transformer'

export class JobTypeResponseDto {
	@Expose()
	id: string

	@Expose()
	code: string

	@Expose()
	displayName: string

	@Expose()
	hexColor?: string
}
