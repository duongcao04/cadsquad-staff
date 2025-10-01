import { ApiResponse, axiosClient } from '@/lib/axios'
import { Comment } from '@/shared/interfaces/comment.interface'
import { CreateCommentInput, UpdateCommentInput } from '@/shared/validationSchemas/comment.schema'
import { CommentRefAll } from '@/shared/types/comment.type'

export const commentApi = {
	/**
	 * Create a new comment
	 */
	create: (data: CreateCommentInput) => {
		return axiosClient.post<ApiResponse<Comment>>('/comments', data)
	},

	/**
	 * Get all comments for a job
	 */
	getByJob: (jobId: string) => {
		return axiosClient.get<ApiResponse<CommentRefAll[]>>(`/comments/job/${jobId}`)
	},

	/**
	 * Get a single comment by ID
	 */
	getById: (id: string) => {
		return axiosClient.get<ApiResponse<Comment>>(`/comments/${id}`)
	},

	/**
	 * Update a comment by ID
	 */
	update: (id: string, data: UpdateCommentInput) => {
		return axiosClient.patch<ApiResponse<Comment>>(`/comments/${id}`, data)
	},

	/**
	 * Delete a comment by ID
	 */
	delete: (id: string) => {
		return axiosClient.delete<ApiResponse<Comment>>(`/comments/${id}`)
	},
}