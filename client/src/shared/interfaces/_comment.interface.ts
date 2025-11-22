export interface ICommentResponse {
	id: string
	content: string
	jobId: string
	userId: string
	parentId?: string
	createdAt: string
	updatedAt: string
}