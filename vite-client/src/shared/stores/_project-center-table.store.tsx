import { Store } from '@tanstack/react-store'

import type { TJob } from '../types'

export const pCenterTableStore = new Store<{
    selectedKeys: Set<string> | 'all'
    newJobNo: string | null
    contextItem: TJob | null
    openContextMenu: boolean
    viewDetail: string | null
}>({
    selectedKeys: new Set(),
    newJobNo: null,
    contextItem: null,
    viewDetail: null,
    openContextMenu: false,
})
