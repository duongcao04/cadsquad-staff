import { Job } from "./job.type"

export interface PaymentChannel {
	id: string
	displayName: string
	hexColor?: string
	logoUrl?: string
	ownerName?: string
	cardNumber?: string
	jobs: Job[]
}
