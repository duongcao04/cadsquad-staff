'use client'

import React, { useEffect, useState } from 'react'

import { useLocale } from 'next-intl'

const Timmer: React.FC = () => {
    const [now, setNow] = useState(new Date())
    const locale = useLocale()

    useEffect(() => {
        const timer = setInterval(() => {
            setNow(new Date())
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    // Format time as HH:mm:ss
    const timeString = now.toLocaleTimeString()
    // Format date as locale string with area
    const dateString = now.toLocaleDateString(locale, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })

    return (
        <div className="flex flex-col items-end">
            <span className="text-base font-mono">{timeString}</span>
            <span className="text-xs text-gray-500">{dateString}</span>
        </div>
    )
}

export default Timmer
