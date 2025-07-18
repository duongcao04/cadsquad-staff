'use client'

import React, { useState } from 'react'

import { Select, SelectItem } from '@heroui/react'
import { Badge, Tabs, TabsProps } from 'antd'
import { Input } from 'antd'
import { Search } from 'lucide-react'
import useSWR from 'swr'

import { getProjects } from '@/lib/swr/actions/project'
import { PROJECT_API } from '@/lib/swr/api'
import { useSearchParam } from '@/shared/hooks/useSearchParam'

const DEFAULT_TAB = 'priority'

export default function TableHeading() {
    const { getSearchParam, setSearchParams, removeSearchParam } =
        useSearchParam()
    const [keywords, setKeywords] = useState('')

    // const { data: jobStatus } = useSWR(JOB_STATUS_API, getJobStatuses)
    const { data: projects } = useSWR(PROJECT_API, () => getProjects(), {
        refreshInterval: 5000,
    })

    const tabValue = getSearchParam('tab') ?? DEFAULT_TAB

    const tabMenus: TabsProps['items'] = [
        {
            key: 'priority',
            label: (
                <button className="flex gap-2 items-center cursor-pointer">
                    <Badge
                        status="success"
                        count={projects?.length}
                        classNames={{
                            indicator: 'opacity-70 scale-80',
                        }}
                    >
                        <p className="px-3 uppercase">Priority</p>
                    </Badge>
                </button>
            ),
        },
        {
            key: 'active',
            label: (
                <button className="flex gap-2 items-center cursor-pointer">
                    <Badge
                        status="success"
                        count={projects?.length}
                        classNames={{
                            indicator: 'opacity-70 scale-80',
                        }}
                    >
                        <p className="px-3 uppercase">Active</p>
                    </Badge>
                </button>
            ),
        },
        {
            key: 'late',
            label: (
                <button className="flex gap-2 items-center cursor-pointer">
                    <Badge
                        status="success"
                        count={projects?.length}
                        classNames={{
                            indicator: 'opacity-70 scale-80',
                        }}
                    >
                        <p className="px-3 uppercase">Late</p>
                    </Badge>
                </button>
            ),
        },
        {
            key: 'delivered',
            label: (
                <button className="flex gap-2 items-center cursor-pointer">
                    <Badge
                        status="success"
                        count={projects?.length}
                        classNames={{
                            indicator: 'opacity-70 scale-80',
                        }}
                    >
                        <p className="px-3 uppercase">Delivered</p>
                    </Badge>
                </button>
            ),
        },
        {
            key: 'completed',
            label: (
                <button className="flex gap-2 items-center cursor-pointer">
                    <Badge
                        status="success"
                        count={projects?.length}
                        classNames={{
                            indicator: 'opacity-70 scale-80',
                        }}
                    >
                        <p className="px-3 uppercase">Completed</p>
                    </Badge>
                </button>
            ),
        },
        {
            key: 'cancelled',
            label: (
                <button className="flex gap-2 items-center cursor-pointer">
                    <Badge
                        status="success"
                        count={projects?.length}
                        classNames={{
                            indicator: 'opacity-70 scale-80',
                        }}
                    >
                        <p className="px-3 uppercase">Cancelled</p>
                    </Badge>
                </button>
            ),
        },
    ]

    const handleTabChange: TabsProps['onChange'] = (activeKey: string) => {
        if (activeKey === DEFAULT_TAB) {
            removeSearchParam('tab')
        } else {
            setSearchParams({ tab: activeKey })
        }
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        setKeywords(value)
        setSearchParams({ search: value })
    }

    const visibleColumns = ['Client', 'Job No.']

    return (
        <div className="grid grid-cols-[1fr_1fr_200px] gap-3">
            <Tabs
                activeKey={tabValue}
                items={tabMenus}
                onChange={handleTabChange}
            />
            <div style={{ flex: 1 }}>
                <Input
                    placeholder="Search"
                    prefix={<Search size={16} color="#999" />}
                    size="large"
                    value={keywords}
                    onChange={handleInputChange}
                    style={{
                        borderRadius: '8px',
                        background: 'white',
                    }}
                />
            </div>
            <Select label="Columns" size="sm" multiple={true}>
                {visibleColumns.map((column, index) => (
                    <SelectItem key={index}>{column}</SelectItem>
                ))}
            </Select>
        </div>
    )
}
