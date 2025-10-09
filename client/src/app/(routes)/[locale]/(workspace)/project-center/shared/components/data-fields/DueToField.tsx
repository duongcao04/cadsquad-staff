'use client'

import { VietnamDateFormat } from '@/lib/dayjs'
import { CountDown } from '@/shared/components'
import { useState } from 'react'

type Props = { data: Date; disableCountdown?: boolean }
export function DueToField({ data, disableCountdown = false }: Props) {
    const [showDate, setShowDate] = useState(false)
    return (
        <button
            className="size-full cursor-pointer"
            onClick={() => {
                setShowDate(!showDate)
            }}
        >
            {showDate ? (
                <p className="tracking-wider">{VietnamDateFormat(data)}</p>
            ) : !disableCountdown ? (
                <CountDown
                    endedDate={data}
                    options={{
                        format: 'short',
                        showYears: true,
                        showMonths: true,
                        showDays: true,
                        showHours: true,
                        showMinutes: true,
                        showSeconds: false,
                    }}
                />
            ) : (
                <p>-</p>
            )}
        </button>
    )
}
