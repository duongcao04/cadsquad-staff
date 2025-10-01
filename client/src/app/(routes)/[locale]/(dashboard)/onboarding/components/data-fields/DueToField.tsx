'use client'
import React, { useState } from 'react'
import CountDown from '@/shared/components/texts/CountDown'
import { VietnamDateFormat } from '@/lib/dayjs'

type Props = { data: Date }
export default function DueToField({ data }: Props) {
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
            ) : (
                <CountDown
                    endedDate={data}
                    options={{
                        format: 'short',
                        showYears: true,
                        showMonths: true,
                        showDays: true,
                        showHours: true,
                        showMinutes: true,
                        showSeconds: true,
                    }}
                />
            )}
        </button>
    )
}
