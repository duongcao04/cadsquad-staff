import { create } from 'zustand'
import { combine } from 'zustand/middleware'
import { Job } from '@/validationSchemas/job.schema'

const getJobVisibleColumns = () => {
    let init: JobStore['jobVisibleColumns'] = [
        'clientName',
        'jobNo',
        'jobName',
        'memberAssign',
        'paymentChannel',
        'jobStatus',
        'income',
        'staffCost',
        'dueAt',
        'action',
    ]
    if (typeof window !== 'undefined') {
        const getLocalStorage = JSON.parse(
            localStorage.getItem('job_visible_cols') ?? 'null'
        )
        if (getLocalStorage !== null) {
            init = { ...getLocalStorage }
        }
        return init
    } else {
        return init
    }
}

export type JobStore = {
    newJobNo: string | null
    jobVisibleColumns: Array<keyof Job | 'action'>
}

type JobAction = {
    setNewJobNo: (jobNo: string | null) => void
    setJobVisibleColumns: (
        jobVisibleCols: JobStore['jobVisibleColumns']
    ) => void
}
export const useJobStore = create(
    combine<JobStore, JobAction>(
        {
            newJobNo: null,
            jobVisibleColumns: getJobVisibleColumns(),
        },
        (set) => ({
            setNewJobNo: (jobNo: string | null) => {
                set(() => {
                    return {
                        newJobNo: jobNo,
                    }
                })
            },
            setJobVisibleColumns: (
                jobVisibleCols: JobStore['jobVisibleColumns']
            ) => {
                set(() => {
                    return {
                        jobVisibleColumns: jobVisibleCols,
                    }
                })
            },
        })
    )
)
