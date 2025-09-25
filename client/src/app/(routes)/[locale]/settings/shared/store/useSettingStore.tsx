import { create } from 'zustand'
import { combine } from 'zustand/middleware'

import { TableProps } from 'antd'

type TableSize = TableProps['size'] | string

type Settings = {
    table: {
        size: TableSize
    }
}

type SettingActions = {
    setTableSize: (size: TableSize) => void
}

const getSettings = () => {
    let initSettings: Settings = {
        table: {
            size: 'small',
        },
    }
    if (typeof window !== 'undefined') {
        const getLocalStorage = JSON.parse(
            localStorage.getItem('settings') ?? 'null'
        )
        if (getLocalStorage !== null) {
            initSettings = { ...getLocalStorage }
        }
        return initSettings
    } else {
        return initSettings
    }
}
export const useSettingStore = create(
    combine<Settings, SettingActions>(
        {
            ...getSettings(),
        },
        (set) => ({
            setTableSize: (size: TableSize) => {
                set((state) => {
                    const newSettings: Settings = {
                        ...state,
                        table: {
                            ...state.table,
                            size,
                        },
                    }
                    if (typeof window !== 'undefined') {
                        localStorage.setItem(
                            'settings',
                            JSON.stringify(newSettings)
                        )
                    }
                    return newSettings
                })
            },
        })
    )
)
