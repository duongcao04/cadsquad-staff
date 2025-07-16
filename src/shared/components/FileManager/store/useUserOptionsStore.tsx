import { create } from 'zustand'
import { combine } from 'zustand/middleware'

type UserOptions = {
    projectTable: {
        size: 'small' | 'middle' | 'large'
    }
}

type UserAction = {
    setProjectTable: (
        action: keyof UserOptions['projectTable'],
        value: UserOptions['projectTable']['size']
    ) => void
}

const getProjectTableOptions: () => UserOptions['projectTable'] = () => {
    let userOptions: UserOptions['projectTable'] = {
        size: 'small' as UserOptions['projectTable']['size'],
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
                value: UserOptions['projectTable']['size']
            ) => {
                if ((action = 'size')) {
                    set((state) => {
                        if (typeof window !== 'undefined') {
                            localStorage.setItem(
                                'options_projectTable',
                                JSON.stringify(state.projectTable)
                            )
                        }
                        return {
                            projectTable: {
                                size: value,
                            },
                        }
                    })
                }
            },
        })
    )
)
