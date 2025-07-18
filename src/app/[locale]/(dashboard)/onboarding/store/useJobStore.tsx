import { create } from 'zustand'
import { combine } from 'zustand/middleware'

type JobStore = {
    newJobNo: string | null
}

type JobAction = {
    setNewJobNo: (jobNo: string | null) => void
}
export const useJobStore = create(
    combine<JobStore, JobAction>(
        {
            newJobNo: null,
        },
        (set) => ({
            setNewJobNo: (jobNo: string | null) => {
                set(() => {
                    return {
                        newJobNo: jobNo,
                    }
                })
            },
        })
    )
)
