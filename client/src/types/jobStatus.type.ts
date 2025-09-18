import { Job } from "./job.type"

export interface JobStatus {
	id: string
	displayName: string
	thumbnailUrl?: string
	hexColor: string
	order: number
	icon?: string
	nextStatusOrder?: number
	prevStatusOrder?: number
	jobs: Job[]
	createdAt: Date
	updatedAt: Date
}
