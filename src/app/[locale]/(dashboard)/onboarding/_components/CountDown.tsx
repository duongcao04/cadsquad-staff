import React, { useEffect, useState } from 'react'

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
        format?: 'auto' | 'full' // 'auto' shows highest unit only, 'full' shows all enabled units
    }
}

export type CountDownOptions = CountDownProps['options']

export const DEFAULT_OPTIONS: CountDownOptions = {
    showYears: true,
    showMonths: true,
    showDays: true,
    showHours: true,
    showMinutes: true,
    showSeconds: true,
    format: 'full',
}
const CountDown: React.FC<CountDownProps> = ({
    endedDate,
    className = '',
    options = DEFAULT_OPTIONS,
}) => {
    const [timeText, setTimeText] = useState('')

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date().getTime()
            const end = new Date(endedDate).getTime()
            const difference = end - now

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

            if (options.format === 'auto') {
                // Show only the highest significant unit
                let text = ''

                if (years > 0 && options.showYears) {
                    text = `${years} year${years > 1 ? 's' : ''} left`
                } else if (months > 0 && options.showMonths) {
                    text = `${months} month${months > 1 ? 's' : ''} left`
                } else if (days > 0 && options.showDays) {
                    text = `${days} day${days > 1 ? 's' : ''} left`
                } else if (hours > 0 && options.showHours) {
                    text = `${hours} hour${hours > 1 ? 's' : ''} left`
                } else if (minutes > 0 && options.showMinutes) {
                    text = `${minutes} minute${minutes > 1 ? 's' : ''} left`
                } else if (options.showSeconds) {
                    text = `${seconds} second${seconds > 1 ? 's' : ''} left`
                }

                setTimeText(text)
            } else {
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

                const text =
                    parts.length > 0 ? parts.join(', ') + ' left' : 'Expired'
                setTimeText(text)
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

    return <span className={className}>{timeText}</span>
}

export default CountDown
