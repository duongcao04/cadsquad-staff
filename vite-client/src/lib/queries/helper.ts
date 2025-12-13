import { addToast } from '@heroui/react'
import { type ApiError } from '../axios'

// Helper function để handle error toast chung (Optional)
export const onErrorToast = (error: unknown, title: string) => {
    const err = error as unknown as ApiError
    addToast({
        title,
        description: err.message,
        color: 'danger',
    })
}
