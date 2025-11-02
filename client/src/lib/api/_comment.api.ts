import { ApiResponse, axiosClient } from '@/lib/axios'
import { Comment } from '@/shared/interfaces'
import { CommentRefAll } from '@/shared/types'
import { CreateCommentInput, UpdateCommentInput } from '@/lib/validationSchemas'

export const commentApi = {
	/**
	 * Create a new comment
	 */
	create: (data: CreateCommentInput) => {
		return axiosClient.post<ApiResponse<Comment>>('/v1/comments', data)
	},

	/**
	 * Get all comments for a job
	 */
	getByJob: (jobId: string) => {
		return axiosClient.get<ApiResponse<CommentRefAll[]>>(`/v1/comments/job/${jobId}`)
	},

	/**
	 * Get a single comment by ID
	 */
	getById: (id: string) => {
		return axiosClient.get<ApiResponse<Comment>>(`/v1/comments/${id}`)
	},

	/**
	 * Update a comment by ID
	 */
	update: (id: string, data: UpdateCommentInput) => {
		return axiosClient.patch<ApiResponse<Comment>>(`/v1/comments/${id}`, data)
	},

	/**
	 * Delete a comment by ID
	 */
	delete: (id: string) => {
		return axiosClient.delete<ApiResponse<Comment>>(`/v1/comments/${id}`)
	},
}