'use client'

import * as React from 'react'

import { JobTabEnum } from '@/shared/enums/jobTab.enum'
import { useJobs } from '@/shared/queries/useJob'
import { JobQueryInput } from '@/shared/validationSchemas/job.schema'
import Badge from '@mui/material/Badge'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar'
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay'
import dayjs, { Dayjs } from 'dayjs'

interface ServerDayProps extends PickersDayProps {
    highlightedDays?: number[]
}

function ServerDay(props: ServerDayProps) {
    const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props

    const isHighlighted =
        !outsideCurrentMonth && highlightedDays.includes(day.date())

    return (
        <Badge
            key={day.toString()}
            overlap="circular"
            badgeContent={isHighlighted ? '🤖' : undefined}
        >
            <PickersDay
                {...other}
                day={day}
                outsideCurrentMonth={outsideCurrentMonth}
            />
        </Badge>
    )
}

interface JobsCalendarProps {
    tab?: JobTabEnum
    queryParams?: Partial<JobQueryInput>
}

export default function SidebarCalendar({
    tab = JobTabEnum.ACTIVE,
    queryParams,
}: JobsCalendarProps) {
    const [currentMonth, setCurrentMonth] = React.useState(dayjs())
    const [highlightedDays, setHighlightedDays] = React.useState<number[]>([])

    // Only fetch jobs for current month
    const { jobs, isLoading, refetch } = useJobs({
        ...queryParams,
        tab,
        limit: 1000, // fetch enough jobs for the month
        page: 1,
    })

    // Update highlightedDays whenever jobs or month changes
    React.useEffect(() => {
        if (!jobs) return

        const daysInMonth = jobs
            .filter((job) => {
                const due = dayjs(job.dueAt)
                return (
                    due.month() === currentMonth.month() &&
                    due.year() === currentMonth.year()
                )
            })
            .map((job) => dayjs(job.dueAt).date())

        setHighlightedDays(daysInMonth)
    }, [jobs, currentMonth])

    // Handle month change
    const handleMonthChange = (date: Dayjs) => {
        setCurrentMonth(date)
        refetch()
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
                sx={{ width: '100%' }}
                defaultValue={dayjs()}
                loading={isLoading}
                onMonthChange={handleMonthChange}
                onChange={(value) => {
                    console.log(value)
                }}
                renderLoading={() => <DayCalendarSkeleton />}
                slots={{ day: ServerDay }}
                slotProps={{
                    day: { highlightedDays } as Partial<ServerDayProps>,
                }}
            />
        </LocalizationProvider>
    )
}
