'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { commentApi } from '@/app/api/comment.api'
import { queryClient } from '@/app/providers/TanstackQueryProvider'

export const useComments = () => {
	return useQuery({
		queryKey: ['comments'],
		queryFn: () => commentApi.findAll(),
		select: (res) => res.data.result,
	})
}

export const useComment = (id: string) => {
	return useQuery({
		queryKey: ['comments', id],
		queryFn: () => commentApi.findOne(id),
		enabled: !!id,
		select: (res) => res.data.result,
	})
}

export const useDeleteCommentMutation = () => {
	return useMutation({
		mutationKey: ['deleteComment'],
		mutationFn: (id: string) => commentApi.remove(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['comments'] })
		},
	})
}
