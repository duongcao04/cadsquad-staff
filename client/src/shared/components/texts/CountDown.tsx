import React, { useEffect, useState } from 'react'

import { calcLeftTime, cn } from '@/lib/utils'
import { MS } from '@/shared/constants/appConstant'

type CountDownProps = {
    endedDate: Date | string
    className?: string
    options?: {
        showYears?: boolean
        showMonths?: boolean
        showDays?: boolean
        showHours?: boolean
        showMinutes?: boolean
        showSeconds?: boolean
        format?: 'auto' | 'full' | 'short' // 'auto' shows highest unit only, 'full' shows all enabled units
    }
}

export type CountDownOptions = CountDownProps['options']
const CountDown: React.FC<CountDownProps> = ({
    endedDate,
    className = '',
    options = {
        showYears: true,
        showMonths: true,
        showDays: true,
        showHours: true,
        showMinutes: true,
        showSeconds: true,
        format: 'full',
    },
}) => {
    const [timeText, setTimeText] = useState('')

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = calcLeftTime(endedDate)

            if (difference <= 0) {
                setTimeText('Expired')
                return
            }

            // Calculate time units
            const years = Math.floor(difference / (1000 * 60 * 60 * 24 * 365))
            const months = Math.floor(
                (difference % (1000 * 60 * 60 * 24 * 365)) /
                    (1000 * 60 * 60 * 24 * 30)
            )
            const days = Math.floor(
                (difference % (1000 * 60 * 60 * 24 * 30)) /
                    (1000 * 60 * 60 * 24)
            )
            const hours = Math.floor(
                (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            )
            const minutes = Math.floor(
                (difference % (1000 * 60 * 60)) / (1000 * 60)
            )
            const seconds = Math.floor((difference % (1000 * 60)) / 1000)

            if (options.format === 'full') {
                // Show all enabled units
                const parts = []

                if (years > 0 && options.showYears) {
                    parts.push(`${years} year${years > 1 ? 's' : ''}`)
                }
                if (months > 0 && options.showMonths) {
                    parts.push(`${months} month${months > 1 ? 's' : ''}`)
                }
                if (days > 0 && options.showDays) {
                    parts.push(`${days} day${days > 1 ? 's' : ''}`)
                }
                if (hours > 0 && options.showHours) {
                    parts.push(`${hours} hour${hours > 1 ? 's' : ''}`)
                }
                if (minutes > 0 && options.showMinutes) {
                    parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`)
                }
                if (seconds > 0 && options.showSeconds) {
                    parts.push(`${seconds} second${seconds > 1 ? 's' : ''}`)
                }
                const textFull =
                    parts.length > 0 ? parts.join(', ') + ' left' : 'Expired'
                setTimeText(textFull)
            } else if (options.format === 'short') {
                // Show all enabled units
                const temp = []

                if (years > 0 && options.showYears) {
                    temp.push(`${years}y`)
                }
                if (months > 0 && options.showMonths) {
                    temp.push(`${months}m`)
                }
                if (days > 0 && options.showDays) {
                    temp.push(`${days}d`)
                }
                if (hours >= 0 && options.showHours) {
                    temp.push(`${hours}h`)
                }
                if (minutes >= 0 && options.showMinutes) {
                    temp.push(`${minutes}m`)
                }
                if (seconds > 0 && options.showSeconds) {
                    temp.push(`${seconds}s`)
                }
                const textShort = temp.length > 0 ? temp.join(', ') : 'Expired'
                setTimeText(textShort)
            } else {
                // Show only the highest significant unit
                let textAuto = ''

                if (years > 0 && options.showYears) {
                    textAuto = `${years} year${years > 1 ? 's' : ''} left`
                } else if (months > 0 && options.showMonths) {
                    textAuto = `${months} month${months > 1 ? 's' : ''} left`
                } else if (days > 0 && options.showDays) {
                    textAuto = `${days} day${days > 1 ? 's' : ''} left`
                } else if (hours > 0 && options.showHours) {
                    textAuto = `${hours} hour${hours > 1 ? 's' : ''} left`
                } else if (minutes > 0 && options.showMinutes) {
                    textAuto = `${minutes} minute${minutes > 1 ? 's' : ''} left`
                } else if (options.showSeconds) {
                    textAuto = `${seconds} second${seconds > 1 ? 's' : ''} left`
                }

                setTimeText(textAuto)
            }
        }

        calculateTimeLeft()
        const timer = setInterval(calculateTimeLeft, 1000)

        return () => clearInterval(timer)
    }, [
        endedDate,
        options.showYears,
        options.showMonths,
        options.showDays,
        options.showHours,
        options.showMinutes,
        options.showSeconds,
        options.format,
    ])

    const oneDayMs = MS.day
    return (
        <span
            className={cn(
                `${calcLeftTime(endedDate) < oneDayMs ? 'text-danger' : ''}`,
                className
            )}
        >
            {timeText}
        </span>
    )
}

export default CountDown
