'use client'

import { useJobs } from '@/lib/queries'
import { useStore } from '@tanstack/react-store'
import { useEffect } from 'react'
import { useSearchParam } from '../../hooks'
import { workbenchStore } from '../../stores'
import WorkbenchTable from './WorkbenchTable'

export default function WorkbenchTableView() {
    const searchKeywords = useStore(
        workbenchStore,
        (state) => state.searchKeywords
    )
    const { jobs } = useJobs({
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

    return <WorkbenchTable data={jobs} />
}
