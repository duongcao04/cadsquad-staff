'use client'

import { addToast } from '@heroui/react'
import { useMutation } from '@tanstack/react-query'
import { imageApi } from '../api'
import { ApiError } from '../axios'

export const useUploadImageMutation = () => {
    return useMutation({
        mutationFn: (image: File) => imageApi.upload(image),
        onError(error) {
            const errorRes = error as unknown as ApiError
            addToast({
                title: errorRes.error,
                description: `Error: ${errorRes.message}`,
                color: 'danger',
            })
        },
    })
}
