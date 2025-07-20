'use client'

import useSWR from 'swr'

import { getJobStatuses } from '@/lib/swr/actions/jobStatus'
import { JOB_STATUS_API } from '@/lib/swr/api'

// Định nghĩa các transition constants
const TRANSITIONS = {
    INPROGRESS_TO_DELIVERED: 2,
    DELIVERED_TO_COMPLETED: 1,
    DELIVERED_RETURN_REVISION: -1,
    REVISION_TO_COMPLETED: 1,
    COMPLETED_TO_FINISH: 1,
} as const

// Định nghĩa job status enum để dễ hiểu
const JOB_STATUS = {
    INPROGRESS: 1,
    DELIVERED: 3, // 1 + 2
    COMPLETED: 4, // 3 + 1
    REVISION: 2, // 3 + (-1)
    FINISHED: 5, // 4 + (-1)
} as const

/**
 * Hook để lấy trạng thái job tiếp theo dựa trên trạng thái hiện tại
 * @param currentStatus - Số thứ tự của trạng thái hiện tại
 * @returns Object chứa thông tin trạng thái tiếp theo
 */
export const useNextJobStatus = (currentStatus: number) => {
    const {
        data: jobStatuses,
        error,
        isLoading,
    } = useSWR(JOB_STATUS_API, () => getJobStatuses())

    // Tính toán next status orders dựa trên current status
    const getNextStatusOrders = (currentStatus: number) => {
        switch (currentStatus) {
            case JOB_STATUS.INPROGRESS:
                return {
                    approved:
                        currentStatus + TRANSITIONS.INPROGRESS_TO_DELIVERED,
                }

            case JOB_STATUS.DELIVERED:
                return {
                    approved:
                        currentStatus + TRANSITIONS.DELIVERED_TO_COMPLETED,
                    disapproved:
                        currentStatus + TRANSITIONS.DELIVERED_RETURN_REVISION,
                }

            case JOB_STATUS.REVISION:
                console.log(currentStatus + TRANSITIONS.REVISION_TO_COMPLETED)

                return {
                    approved: currentStatus + TRANSITIONS.REVISION_TO_COMPLETED,
                }

            case JOB_STATUS.COMPLETED:
                return {
                    approved: currentStatus + TRANSITIONS.COMPLETED_TO_FINISH,
                }

            default:
                return { approved: currentStatus }
        }
    }

    const nextStatusOrders = getNextStatusOrders(currentStatus)
    console.log('Next status orders:', nextStatusOrders)

    const nextStatuses = {
        approved: jobStatuses?.find(
            (status) => status.order === nextStatusOrders.approved
        ),
        ...(nextStatusOrders.disapproved && {
            disapproved: jobStatuses?.find(
                (status) => status.order === nextStatusOrders.disapproved
            ),
        }),
    }

    console.log(Object.keys(nextStatuses).length > 1)

    return {
        nextStatuses,
        isLoading,
        error,
        // Utility functions
        hasMultipleOptions: Object.keys(nextStatuses).length > 1,
        canProgress: nextStatuses.approved || nextStatuses.disapproved,
    }
}

// Hook mở rộng để handle nhiều possible next statuses
export const useAllPossibleNextJobStatuses = (currentStatus: number) => {
    const {
        data: jobStatuses,
        error,
        isLoading,
    } = useSWR(JOB_STATUS_API, () => getJobStatuses())

    const getPossibleNextStatuses = (currentStatus: number): number[] => {
        switch (currentStatus) {
            case JOB_STATUS.INPROGRESS:
                return [currentStatus + TRANSITIONS.INPROGRESS_TO_DELIVERED]

            case JOB_STATUS.DELIVERED:
                return [
                    currentStatus + TRANSITIONS.DELIVERED_TO_COMPLETED,
                    currentStatus + TRANSITIONS.DELIVERED_RETURN_REVISION,
                ]

            case JOB_STATUS.REVISION:
                return [currentStatus + TRANSITIONS.REVISION_TO_COMPLETED]

            case JOB_STATUS.COMPLETED:
                return [currentStatus + TRANSITIONS.COMPLETED_TO_FINISH]

            default:
                return []
        }
    }

    const possibleNextOrders = getPossibleNextStatuses(currentStatus)
    const possibleNextStatuses = possibleNextOrders
        .map((order) => jobStatuses?.find((status) => status.order === order))
        .filter(Boolean)

    return {
        possibleNextStatuses,
        isLoading,
        error,
        hasMultipleOptions: possibleNextStatuses.length > 1,
    }
}
