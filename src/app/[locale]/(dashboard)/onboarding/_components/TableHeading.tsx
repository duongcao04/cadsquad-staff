'use client'

import React, { useEffect, useState } from 'react'

import { Badge, InputProps, Tabs, TabsProps } from 'antd'
import { Input } from 'antd'
import { Search } from 'lucide-react'
import useSWR from 'swr'

import { getJobStatuses } from '@/lib/swr/actions/jobStatus'
import { getProjects } from '@/lib/swr/actions/project'
import { JOB_STATUS_API, PROJECT_API } from '@/lib/swr/api'
import { useSearchParam } from '@/shared/hooks/useSearchParam'

export default function TableHeading() {
    const { getSearchParam, setSearchParams, removeSearchParam } =
        useSearchParam()
    const [keywords, setKeywords] = useState('')

    const { data: jobStatus } = useSWR(JOB_STATUS_API, getJobStatuses)
    const { data: projects } = useSWR(PROJECT_API, () => getProjects())

    const tabValue = getSearchParam('tab') ?? 'all'

    useEffect(() => {
        if (!keywords) {
            removeSearchParam('search')
        }
    }, [getSearchParam])

    const handleSearch: InputProps['onPressEnter'] = () => {
        setSearchParams({ search: keywords })
    }

    const tabMenus: TabsProps['items'] = jobStatus
        ?.map((status) => {
            return {
                key: status.id!.toString(),
                label: (
                    <button
                        className="flex gap-2 items-center cursor-pointer"
                        onClick={() =>
                            setSearchParams({ tab: status.id!.toString() })
                        }
                    >
                        <Badge
                            status="success"
                            count={status._count.projects}
                            classNames={{
                                indicator: 'opacity-70 scale-80',
                            }}
                        >
                            <p className="px-2">{status.title}</p>
                        </Badge>
                    </button>
                ),
            }
        })
        .toReversed()
        .concat({
            key: 'all',
            label: (
                <button
                    className="flex gap-2 items-center cursor-pointer"
                    onClick={() => removeSearchParam('tab')}
                >
                    <Badge
                        status="success"
                        count={projects?.length}
                        classNames={{
                            indicator: 'opacity-70 scale-80',
                        }}
                    >
                        <p className="px-3">All</p>
                    </Badge>
                </button>
            ),
        })
        .toReversed()

    return (
        <div className="grid grid-cols-[600px_1fr] gap-10">
            <Tabs activeKey={tabValue} items={tabMenus} />
            <div style={{ flex: 1 }}>
                <Input
                    placeholder="Search"
                    prefix={<Search size={16} color="#999" />}
                    size="large"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    onPressEnter={handleSearch}
                    style={{
                        borderRadius: '8px',
                        background: 'white',
                    }}
                />
            </div>
        </div>
    )
}
