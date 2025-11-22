import { ApiResponse, axiosClient } from '@/lib/axios'
import { TCreateCommentInput, TUpdateCommentInput } from '@/lib/validationSchemas'
import { ICommentResponse } from '@/shared/interfaces'
import { TCommentRefAll } from '@/shared/types'

export const commentApi = {
	/**
	 * Create a new comment
	 */
	create: (data: TCreateCommentInput) => {
		return axiosClient.post<ApiResponse<ICommentResponse>>('/v1/comments', data)
	},

	/**
	 * Get all comments for a job
	 */
	getByJob: (jobId: string) => {
		return axiosClient.get<ApiResponse<TCommentRefAll[]>>(`/v1/comments/job/${jobId}`)
	},

	/**
	 * Get a single comment by ID
	 */
	getById: (id: string) => {
		return axiosClient.get<ApiResponse<ICommentResponse>>(`/v1/comments/${id}`)
	},

	/**
	 * Update a comment by ID
	 */
	update: (id: string, data: TUpdateCommentInput) => {
		return axiosClient.patch<ApiResponse<{ id: string }>>(`/v1/comments/${id}`, data)
	},

	/**
	 * Delete a comment by ID
	 */
	delete: (id: string) => {
		return axiosClient.delete(`/v1/comments/${id}`)
	},
}