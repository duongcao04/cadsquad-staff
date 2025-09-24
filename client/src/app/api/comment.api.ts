
import { axiosClient } from '@/lib/axios'
// import { CreateCommentDto, UpdateCommentDto } from '@/shared/interfaces/comment.interface'

export const commentApi = {
	// create: (data: CreateCommentDto) => {
	// 	return axiosClient.post('/comment', data)
	// },
	findAll: () => {
		return axiosClient.get('/comment')
	},
	findOne: (id: string) => {
		return axiosClient.get(`/comment/${id}`)
	},
	// update: (id: string, data: UpdateCommentDto) => {
	// 	return axiosClient.patch(`/comment/${id}`, data)
	// },
	remove: (id: string) => {
		return axiosClient.delete(`/comment/${id}`)
	},
}
