'use client'

import { dateFormatter } from '@/lib/dayjs'
import { Button } from '@heroui/react'
import { useState } from 'react'
import { CountdownDay } from '../ui/countdown-day'

type DueToViewProps = { data: Date; disableCountdown?: boolean }
export function DueToView({ data, disableCountdown = false }: DueToViewProps) {
    const [showDate, setShowDate] = useState(false)

    return (
        <Button
            onPress={() => setShowDate(!showDate)}
            className="!w-full !px-2 !h-7 flex items-center justify-start line-clamp-1 font-medium !rounded-md text-end"
            variant="light"
        >
            {showDate ? (
                <span className="tracking-wider">{dateFormatter(data)}</span>
            ) : !disableCountdown ? (
                <CountdownDay
                    targetDate={data}
                    units={{
                        days: true,
                        hours: true,
                        minutes: true,
                        seconds: false,
                        months: false,
                        years: false,
                    }}
                />
            ) : (
                <span></span>
            )}
        </Button>
    )
}
