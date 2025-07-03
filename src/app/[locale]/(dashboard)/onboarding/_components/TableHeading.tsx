'use client'

import React, { useEffect, useState } from 'react'

import { InputProps, Tabs, TabsProps } from 'antd'
import { Input } from 'antd'
import { Search } from 'lucide-react'
import {
    CircleCheckBig,
    CircleDotDashed,
    Grid2x2,
    SquareStack,
} from 'lucide-react'

import { useSearchParam } from '@/shared/hooks/useSearchParam'

export default function TableHeading() {
    const { getSearchParam, setSearchParams, removeSearchParam } =
        useSearchParam()
    const [keywords, setKeywords] = useState('')

    const tabValue = getSearchParam('tab')

    useEffect(() => {
        if (!tabValue) {
            setSearchParams({ tab: 'all' })
        }
        if (!keywords) {
            removeSearchParam('search')
        }
    }, [getSearchParam])

    const handleSearch: InputProps['onPressEnter'] = () => {
        setSearchParams({ search: keywords })
    }

    const tabMenus: TabsProps['items'] = [
        {
            key: 'all',
            label: (
                <button
                    className="flex gap-2 items-center cursor-pointer"
                    onClick={() => setSearchParams({ tab: 'all' })}
                >
                    <Grid2x2 size={16} />
                    <p>All</p>
                </button>
            ),
        },
        {
            key: 'onProgress',
            label: (
                <button
                    className="flex gap-2 items-center cursor-pointer"
                    onClick={() => setSearchParams({ tab: 'onProgress' })}
                >
                    <CircleDotDashed size={16} />
                    <p>On Progess</p>
                </button>
            ),
        },
        {
            key: 'revision',
            label: (
                <button
                    className="flex gap-2 items-center cursor-pointer"
                    onClick={() => setSearchParams({ tab: 'revision' })}
                >
                    <SquareStack size={16} />
                    <p>Revision</p>
                </button>
            ),
        },
        {
            key: 'delivered',
            label: (
                <button
                    className="flex gap-2 items-center cursor-pointer"
                    onClick={() => setSearchParams({ tab: 'delivered' })}
                >
                    <CircleCheckBig size={16} />
                    <p>Delivered</p>
                </button>
            ),
        },
    ]

    return (
        <div className="grid grid-cols-[420px_1fr] gap-10">
            <Tabs defaultActiveKey={tabValue as string} items={tabMenus} />
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
