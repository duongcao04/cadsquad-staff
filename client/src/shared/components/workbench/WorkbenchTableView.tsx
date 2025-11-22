'use client'

import { useJobs } from '@/lib/queries'
import WorkbenchTable from './WorkbenchTable'
import { useEffect } from 'react'
import { useSearchParam } from '../../hooks'
import { workbenchStore } from '../../stores'
import { useStore } from '@tanstack/react-store'

export default function WorkbenchTableView() {
    const searchKeywords = useStore(
        workbenchStore,
        (state) => state.searchKeywords
    )
    const { projects } = useJobs({
        search: searchKeywords,
    })

    const { getSearchParam, setSearchParams } = useSearchParam()

    // Update searchKeywords state when change
    const existSearchKeywords = getSearchParam('q')
    useEffect(() => {
        if (existSearchKeywords) {
            workbenchStore.setState((state) => ({
                ...state,
                searchKeywords: existSearchKeywords,
            }))
            return
        }
    }, [existSearchKeywords])

    // Update searchKeywords state when change
    useEffect(() => {
        setSearchParams({ q: searchKeywords })
    }, [searchKeywords])

    return <WorkbenchTable data={projects} />
}
