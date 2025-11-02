'use client'

import { dateFormatter } from '@/lib/dayjs'
import { Button } from '@heroui/react'
import { useState } from 'react'
import { Countdown } from '../../../../../../../../shared/components'

type Props = { data: Date; disableCountdown?: boolean }
export function DueToField({ data, disableCountdown = false }: Props) {
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
                <Countdown
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
