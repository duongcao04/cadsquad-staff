'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import WorkbenchTabs from './_components/WorkbenchTabs'
import { TabsProps } from 'antd'
import WorkbenchTable from './_components/WorkbenchTable'
import DetailTab from './_components/DetailTab'
import { Job } from '@/validationSchemas/job.schema'

type TargetKey = React.MouseEvent | React.KeyboardEvent | string
export type TabList = NonNullable<TabsProps['items']>

export default function WorkbenchPage() {
    const [activeKey, setActiveKey] = useState('')
    const [items, setItems] = useState<TabList>([])

    const onAddTab = useCallback((record: Job) => {
        const newActiveKey = `job#${record.jobNo}`

        setItems((prevItems) => {
            // Check if tab already exists in the current state
            const existingTab = prevItems.find(
                (item) => item.key === newActiveKey
            )
            if (existingTab) {
                // If tab exists, just switch to it (don't modify items)
                setActiveKey(newActiveKey)
                return prevItems
            }

            // Create new tab if it doesn't exist
            const newTab = {
                label: `#${record.jobNo}`,
                children: <DetailTab jobNo={record.jobNo} />,
                key: newActiveKey,
                closable: true,
            }

            setActiveKey(newActiveKey)
            return [...prevItems, newTab]
        })
    }, [])

    useEffect(() => {
        const initValue = [
            {
                key: 'all',
                label: 'All active',
                children: <WorkbenchTable onAddTab={onAddTab} />,
                closable: false,
            },
        ]
        setItems(initValue)
        setActiveKey(initValue[0].key)
    }, [onAddTab])

    const newTabIndex = useRef(0)

    const onChange = (newActiveKey: string) => {
        setActiveKey(newActiveKey)
    }

    const addTab = () => {
        const newActiveKey = `newTab${newTabIndex.current++}`
        const newTab = {
            label: 'New Tab',
            children: 'Content of new Tab',
            key: newActiveKey,
            closable: true,
        }
        setItems((prevItems) => [...prevItems, newTab])
        setActiveKey(newActiveKey)
    }

    const removeTab = (targetKey: TargetKey) => {
        setItems((prevItems) => {
            const newPanes = prevItems.filter((item) => item.key !== targetKey)

            // Update active key if the removed tab was active
            if (activeKey === targetKey && newPanes.length > 0) {
                const removedIndex = prevItems.findIndex(
                    (item) => item.key === targetKey
                )
                const newActiveIndex = removedIndex > 0 ? removedIndex - 1 : 0
                setActiveKey(newPanes[newActiveIndex].key)
            }

            return newPanes
        })
    }

    const onEditTab = (
        targetKey: React.MouseEvent | React.KeyboardEvent | string,
        action: 'add' | 'remove'
    ) => {
        if (action === 'add') {
            addTab()
        } else {
            removeTab(targetKey)
        }
    }

    return (
        <div className="size-full">
            <WorkbenchTabs
                items={items}
                setItems={setItems}
                onEdit={onEditTab}
                onChange={onChange}
                activeKey={activeKey}
            />
        </div>
    )
}
