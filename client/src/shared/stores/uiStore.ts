import { create } from 'zustand'
import { combine } from 'zustand/middleware'

export enum ESidebarStatus {
    EXPAND = 'expand',
    COLLAPSE = 'collapse',
}
type UiStore = {
    sidebarStatus: 'expand' | 'collapse'
}

type UiAction = {
    setSidebarStatus: (status: 'expand' | 'collapse') => void
    toggleSidebar: () => void
}
export const useUiStore = create(
    combine<UiStore, UiAction>(
        {
            sidebarStatus: ESidebarStatus.EXPAND,
        },
        (set) => ({
            setSidebarStatus: (status: 'expand' | 'collapse') => {
                set(() => {
                    return {
                        sidebarStatus: status,
                    }
                })
            },
            toggleSidebar: () => {
                set((state) => ({
                    sidebarStatus:
                        state.sidebarStatus === ESidebarStatus.EXPAND
                            ? ESidebarStatus.COLLAPSE
                            : ESidebarStatus.EXPAND,
                }))
            },
        })
    )
)
