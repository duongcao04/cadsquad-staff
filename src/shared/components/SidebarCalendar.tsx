'use client'

import { Calendar, theme } from 'antd'
import type { CalendarProps } from 'antd'
import type { Dayjs } from 'dayjs'

const onPanelChange = (value: Dayjs, mode: CalendarProps<Dayjs>['mode']) => {
    console.log(value.format('YYYY-MM-DD'), mode)
}

export default function SidebarCalendar() {
    const { token } = theme.useToken()

    const wrapperStyle: React.CSSProperties = {
        width: 240,
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: '20px',
        background: 'transparent',
    }

    return (
        <div className="size-full">
            <div style={wrapperStyle}>
                <Calendar
                    fullscreen={false}
                    headerRender={() => {
                        return <div></div>
                    }}
                    onPanelChange={onPanelChange}
                />
            </div>
        </div>
    )
}
