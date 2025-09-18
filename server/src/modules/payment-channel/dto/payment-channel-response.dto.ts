import { Expose } from 'class-transformer'

export class PaymentChannelResponseDto {
	@Expose()
	id: string

	@Expose()
	displayName: string

	@Expose()
	hexColor?: string

	@Expose()
	logoUrl?: string

	@Expose()
	ownerName?: string

	@Expose()
	cardNumber?: string
}
