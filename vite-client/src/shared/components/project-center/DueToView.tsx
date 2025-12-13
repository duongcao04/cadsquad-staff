'use client'

import { dateFormatter } from '@/lib/dayjs'
import { Button } from '@heroui/react'
import { useState } from 'react'
import CountdownTimer from '../ui/countdown-timer'
import dayjs from 'dayjs'

type DueToViewProps = { data: Date; disableCountdown?: boolean }
export function DueToView({ data, disableCountdown = false }: DueToViewProps) {
    const [showDate, setShowDate] = useState(false)
    const targetDate = dayjs(data)

    return (
        <Button
            onPress={() => setShowDate(!showDate)}
            className="!w-full !px-2 !h-7 flex items-center justify-start line-clamp-1 font-medium !rounded-md text-end"
            variant="light"
        >
            {showDate ? (
                <span className="tracking-wider">
                    {dateFormatter(data, {
                        format: 'semiLongDate',
                    })}
                </span>
            ) : !disableCountdown ? (
                <CountdownTimer
                    targetDate={targetDate}
                    hiddenUnits={['second', 'year']}
                />
            ) : (
                <span></span>
            )}
        </Button>
    )
}
