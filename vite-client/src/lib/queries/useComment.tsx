'use client'

import { queryClient } from '@/app/providers/TanstackQueryProvider'
import { commentApi } from '@/lib/api'
import {
    TCreateCommentInput,
    TUpdateCommentInput,
} from '@/lib/validationSchemas'
import { addToast } from '@heroui/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import lodash from 'lodash'
import { useMemo } from 'react'
import { ICommentResponse } from '../../shared/interfaces'
import { TComment } from '../../shared/types'

const mapItem: (item: ICommentResponse) => TComment = (item) => ({
    content: item.content ?? '',
    user: item.user ?? null,
    id: item.id,
    updatedAt: new Date(item.updatedAt),
    createdAt: new Date(item.createdAt),
})
export const useComments = (jobId: string) => {
    const { data, isFetching, isLoading } = useQuery({
        queryKey: ['comments', 'jobs', 'id', jobId],
        queryFn: () => {
            return commentApi.getByJob(jobId)
        },
        enabled: !!jobId,
        select: (res) => res?.data.result,
    })

    const comments = useMemo(() => {
        const commentsData = data

        if (!Array.isArray(commentsData)) {
            return []
        }

        return commentsData.map((item) => mapItem(item))
    }, [data])

    return {
        comments: comments ?? [],
        data: comments ?? [],
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
    const comment = useMemo(() => {
        const commentData = data

        if (lodash.isEmpty(commentData)) {
            return undefined
        }

        return mapItem(commentData)
    }, [data])
    return {
        comment: comment,
        data: comment,
        isLoading: isFetching || isLoading,
    }
}

export const useCreateComment = () => {
    return useMutation({
        mutationKey: ['comment'],
        mutationFn: (data: TCreateCommentInput) => commentApi.create(data),
        onSuccess: (res) => {
            addToast({
                title: 'Bình luận thành công',
                color: 'success',
            })
            queryClient.invalidateQueries({
                queryKey: ['comments', 'jobs', 'id', res.data.result?.jobId],
            })
        },
    })
}
export const useUpdateComment = () => {
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: TUpdateCommentInput }) =>
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
