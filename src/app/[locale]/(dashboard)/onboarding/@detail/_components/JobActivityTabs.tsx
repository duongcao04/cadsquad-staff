'use client'

import { Tab, TabItemProps, Tabs } from '@heroui/react'
import React from 'react'

export default function JobActivityTabs() {
    const tabItems: TabItemProps[] = [
        { key: '1', title: 'Work log', children: 'Content' },
        { key: '2', title: 'Comments', isDisabled: true },
    ]
    return (
        <Tabs aria-label="Job action tabs">
            {tabItems.map((item) => {
                return <Tab key={item.key} title={item.title} {...item} />
            })}
        </Tabs>
    )
}
