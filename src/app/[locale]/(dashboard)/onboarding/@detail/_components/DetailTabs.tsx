import React from 'react'

import { Tabs, TabsProps } from 'antd'

export default function DetailTabs() {
    const tabItems: TabsProps['items'] = [
        {
            key: '1',
            label: <p className="px-5">History</p>,
            children: 'Content of Tab Pane 1',
        },
        {
            key: '2',
            label: <p className="px-5">More</p>,
            children: 'Content of More Pane',
        },
    ]
    return <Tabs defaultActiveKey="1" items={tabItems} />
}
