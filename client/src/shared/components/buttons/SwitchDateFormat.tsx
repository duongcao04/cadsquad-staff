'use client'
import React, { useState } from 'react'

import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(localizedFormat)
dayjs.extend(relativeTime)

type Props = { data: string | Date }
export default function SwitchDateFormat({ data }: Props) {
    const [dateFormat, setDateFormat] = useState<'short' | 'full'>('short')
    return (
        <button
            onClick={() => {
                if (dateFormat === 'full') {
                    setDateFormat('short')
                } else {
                    setDateFormat('full')
                }
            }}
            className="mt-0 cursor-pointer text-xs"
        >
            {dateFormat === 'full' ? (
                <>
                    {dayjs(data).format('LL')} at {dayjs(data).format('LT')}
                </>
            ) : (
                <>{dayjs().to(dayjs(data))}</>
            )}
        </button>
    )
}
