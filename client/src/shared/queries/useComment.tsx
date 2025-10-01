'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { commentApi } from '@/app/api/comment.api'
import { queryClient } from '@/app/providers/TanstackQueryProvider'
import {
    CreateCommentInput,
    UpdateCommentInput,
} from '@/shared/validationSchemas/comment.schema'

export const useComments = (jobId?: string) => {
    const { data, isFetching, isLoading } = useQuery({
        queryKey: ['comments', 'jobs', jobId],
        queryFn: () => {
            if (!jobId) {
                return undefined
            }
            return commentApi.getByJob(jobId)
        },
        enabled: !!jobId,
        select: (res) => res?.data.result,
    })
    return {
        comments: data,
        isLoading: isFetching || isLoading,
    }
}

export const useCommentById = (commentId?: string) => {
    const { data, isFetching, isLoading } = useQuery({
        queryKey: ['comments', 'id', commentId],
        queryFn: () => {
            if (!commentId) {
                return undefined
            }
            return commentApi.getById(commentId)
        },
        enabled: !!commentId,
        select: (res) => res?.data.result,
    })
    return {
        comment: data,
        isLoading: isFetching || isLoading,
    }
}

export const useCreateComment = () => {
    return useMutation({
        mutationFn: (data: CreateCommentInput) =>
            commentApi.create(data).then((res) => res.data.result),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments'] }) // refresh cache
        },
    })
}
export const useUpdateComment = () => {
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateCommentInput }) =>
            commentApi.update(id, data).then((res) => res.data.result),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['comment', variables.id],
            })
            queryClient.invalidateQueries({ queryKey: ['comments'] })
        },
    })
}

export const useDeleteCommentMutation = () => {
    return useMutation({
        mutationKey: ['deleteComment'],
        mutationFn: (id: string) => commentApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments'] })
        },
    })
}
