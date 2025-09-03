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
            init = getLocalStorage
        }
        return init
    } else {
        return init
    }
}

const getJobFinishItems = () => {
    if (typeof window !== 'undefined') {
        return Boolean(
            JSON.parse(localStorage.getItem('hide_finish_items') ?? 'true')
        )
    } else {
        return true
    }
}

export type TJobVisibleColumn = keyof Job | 'action' | 'thumbnail' | 'jobStatus'
export type JobStore = {
    newJobNo: string | null
    jobVisibleColumns: Array<TJobVisibleColumn>
    isHideFinishItems: boolean
}

type JobAction = {
    setNewJobNo: (jobNo: string | null) => void
    setJobVisibleColumns: (jobVisibleCols: TJobVisibleColumn[]) => void
    setHideFinishItems: (isHidden: boolean) => void
}
export const useJobStore = create(
    combine<JobStore, JobAction>(
        {
            newJobNo: null,
            jobVisibleColumns: getJobVisibleColumns(),
            isHideFinishItems: getJobFinishItems(),
        },
        (set) => ({
            setNewJobNo: (jobNo: string | null) => {
                set(() => {
                    return {
                        newJobNo: jobNo,
                    }
                })
            },
            setJobVisibleColumns: (jobVisibleCols: TJobVisibleColumn[]) => {
                set(() => {
                    if (typeof window !== 'undefined') {
                        localStorage.setItem(
                            'job_visible_cols',
                            JSON.stringify(jobVisibleCols)
                        )
                    }
                    return {
                        jobVisibleColumns: jobVisibleCols,
                    }
                })
            },
            setHideFinishItems: (isHidden: boolean) => {
                set(() => {
                    if (typeof window !== 'undefined') {
                        localStorage.setItem(
                            'hide_finish_items',
                            JSON.stringify(isHidden)
                        )
                    }
                    return {
                        isHideFinishItems: isHidden,
                    }
                })
            },
        })
    )
)
