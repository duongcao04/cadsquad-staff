import { User } from "./user.type"

export interface Department {
	id: string
	displayName: string
	notes?: string | null
	code: string
	users?: User[]
	createdAt: Date
	updatedAt: Date
}
