'use client'

import React from 'react'

import { Calendar } from 'antd'
import type { CalendarProps } from 'antd'
import type { Dayjs } from 'dayjs'

const onPanelChange = (value: Dayjs, mode: CalendarProps<Dayjs>['mode']) => {
    console.log(value.format('YYYY-MM-DD'), mode)
}

const CalendarManage: React.FC = () => {
    return (
        <div
            className="p-2 rounded-2xl h-full border border-gray-100"
            style={{
                boxShadow:
                    'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px',
            }}
        >
            <Calendar fullscreen={false} onPanelChange={onPanelChange} />
        </div>
    )
}

export default CalendarManage
