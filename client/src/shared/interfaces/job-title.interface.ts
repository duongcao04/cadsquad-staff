export interface JobTitle {
	id: string
	displayName: string
	notes?: string | null
	code: string
	createdAt: string // hoặc Date nếu muốn parse thành Date
	updatedAt: string // hoặc Date nếu muốn parse thành Date
}
