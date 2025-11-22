'use client'

import dayjs, { Dayjs } from 'dayjs'
import React, { useEffect, useMemo, useState } from 'react'

type CountdownUnits = {
    years?: boolean
    months?: boolean
    days?: boolean
    hours?: boolean
    minutes?: boolean
    seconds?: boolean
}

type CountdownProps = {
    targetDate: string | Date | Dayjs
    units?: CountdownUnits
    tickMs?: number // default 1000
    onEndText?: string // shown when time is up
    showZero?: boolean // shown 0 value of part
}

type Parts = {
    years: number
    months: number
    days: number
    hours: number
    minutes: number
    seconds: number
    done: boolean
}

function computeParts(
    now: Dayjs,
    targetDate: Dayjs,
    units: Required<CountdownUnits>
): Parts {
    if (targetDate.isBefore(now)) {
        return {
            years: 0,
            months: 0,
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            done: true,
        }
    }

    let cursor = now
    let years = 0,
        months = 0,
        days = 0,
        hours = 0,
        minutes = 0,
        seconds = 0

    // Years
    if (units.years) {
        years = targetDate.diff(cursor, 'year')
        cursor = cursor.add(years, 'year')
    }

    // Months
    if (units.months) {
        months = targetDate.diff(cursor, 'month')
        cursor = cursor.add(months, 'month')
    }
    // If months are hidden, we DON'T advance the cursor here — so the "days" diff below
    // will absorb the remaining months as days.

    // Days
    if (units.days) {
        days = targetDate.diff(cursor, 'day')
        cursor = cursor.add(days, 'day')
    }

    // Hours
    if (units.hours) {
        hours = targetDate.diff(cursor, 'hour')
        cursor = cursor.add(hours, 'hour')
    }

    // Minutes
    if (units.minutes) {
        minutes = targetDate.diff(cursor, 'minute')
        cursor = cursor.add(minutes, 'minute')
    }

    // Seconds
    if (units.seconds) {
        seconds = targetDate.diff(cursor, 'second')
        // cursor = cursor.add(seconds, "second"); // not needed further
    }

    return { years, months, days, hours, minutes, seconds, done: false }
}

export function Countdown({
    targetDate,
    units,
    tickMs = 1000,
    onEndText = 'Time’s up!',
    showZero = false,
}: CountdownProps) {
    const targetD = useMemo(() => dayjs(targetDate), [targetDate])

    // Defaults: show all units
    const u: Required<CountdownUnits> = {
        years: units?.years ?? true,
        months: units?.months ?? true,
        days: units?.days ?? true,
        hours: units?.hours ?? true,
        minutes: units?.minutes ?? true,
        seconds: units?.seconds ?? true,
    }

    const [parts, setParts] = useState<Parts>(() =>
        computeParts(dayjs(), targetD, u)
    )

    useEffect(() => {
        const id = setInterval(() => {
            setParts(computeParts(dayjs(), targetD, u))
        }, tickMs)
        return () => clearInterval(id)
    }, [
        targetD,
        tickMs,
        u.years,
        u.months,
        u.days,
        u.hours,
        u.minutes,
        u.seconds,
    ])

    if (parts.done) {
        return <span>{onEndText}</span>
    }

    // Build display based on toggles
    const items: string[] = []
    if (showZero) {
        if (u.years) items.push(`${parts.years}y`)
        if (u.months) items.push(`${parts.months}mo`)
        if (u.days) items.push(`${parts.days}d`)
        if (u.hours) items.push(`${parts.hours}h`)
        if (u.minutes) items.push(`${parts.minutes}m`)
        if (u.seconds) items.push(`${parts.seconds}s`)
    } else {
        if (u.years && parts.years > 0) items.push(`${parts.years}y`)
        if (u.months && parts.months > 0) items.push(`${parts.months}mo`)
        if (u.days && parts.days > 0) items.push(`${parts.days}d`)
        if (u.hours && parts.hours > 0) items.push(`${parts.hours}h`)
        if (u.minutes && parts.minutes > 0) items.push(`${parts.minutes}m`)
        if (u.seconds && parts.seconds > 0) items.push(`${parts.seconds}s`)
    }

    return <span>{items.join(' ')}</span>
}

export default React.memo(Countdown)
