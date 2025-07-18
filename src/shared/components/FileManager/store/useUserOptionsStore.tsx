import { create } from 'zustand'
import { combine } from 'zustand/middleware'

import { Project } from '@/validationSchemas/project.schema'

type UserOptions = {
    projectTable: {
        size: 'small' | 'middle' | 'large'
        visibleColumns: Array<keyof Project | 'action'>
    }
}

type UserAction = {
    setProjectTable: (
        action: keyof UserOptions['projectTable'],
        value: unknown
    ) => void
}

const getProjectTableOptions: () => UserOptions['projectTable'] = () => {
    let userOptions: UserOptions['projectTable'] = {
        size: 'small' as UserOptions['projectTable']['size'],
        visibleColumns: [
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
        ],
    }

    if (typeof window !== 'undefined') {
        const getLocalStorage = JSON.parse(
            localStorage.getItem('options_projectTable') ?? 'null'
        )
        if (getLocalStorage !== null) {
            userOptions = getLocalStorage
        }
        return userOptions
    } else {
        return userOptions
    }
}
export const useUserOptionsStore = create(
    combine<UserOptions, UserAction>(
        {
            projectTable: getProjectTableOptions(),
        },
        (set) => ({
            setProjectTable: (
                action: keyof UserOptions['projectTable'],
                value: unknown
            ) => {
                switch (action) {
                    case 'size':
                        set((state) => {
                            const newProjectTable = {
                                ...state.projectTable,
                                size: value,
                            }
                            if (typeof window !== 'undefined') {
                                localStorage.setItem(
                                    'options_projectTable',
                                    JSON.stringify(newProjectTable)
                                )
                            }
                            return {
                                projectTable: newProjectTable,
                            } as UserOptions
                        })
                        break
                    case 'visibleColumns':
                        set((state) => {
                            const newProjectTable = {
                                ...state.projectTable,
                                visibleColumns: value,
                            }

                            if (typeof window !== 'undefined') {
                                localStorage.setItem(
                                    'options_projectTable',
                                    JSON.stringify(newProjectTable)
                                )
                            }
                            return {
                                projectTable: newProjectTable,
                            } as UserOptions
                        })
                        break
                    default:
                        return
                }
            },
        })
    )
)
