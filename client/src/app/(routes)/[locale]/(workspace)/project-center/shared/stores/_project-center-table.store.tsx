import { Job } from '@/shared/interfaces'
import { Store } from '@tanstack/react-store'

export const pCenterTableStore = new Store<{
    selectedKeys: Set<string> | 'all'
    newJobNo: string | null
    contextItem: Job | null
    openContextMenu: boolean
}>({
    selectedKeys: new Set(),
    newJobNo: null,
    contextItem: null,
    openContextMenu: false,
})
