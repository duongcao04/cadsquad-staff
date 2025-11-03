'use client'

import { useJobs } from '@/lib/queries'
import { JobQueryInput } from '@/lib/validationSchemas'
import { ProjectCenterTabEnum } from '@/shared/enums'
import { useDisclosure } from '@heroui/react'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar'
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton'
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay'
import dayjs, { Dayjs } from 'dayjs'
import * as React from 'react'
import { JobDueModal } from '../../modals'

interface ServerDayProps extends PickersDayProps {
    highlightedDays?: number[]
}

function ServerDay(props: ServerDayProps) {
    const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props

    const isHighlighted =
        !outsideCurrentMonth && highlightedDays.includes(day.date())

    return (
        <PickersDay
            {...other}
            day={day}
            outsideCurrentMonth={outsideCurrentMonth}
        >
            <div className="flex flex-col items-center justify-center">
                <span>{props.day.date()}</span>
                <div
                    className="size-1 rounded-full"
                    style={{
                        backgroundColor: isHighlighted ? 'red' : 'transparent',
                    }}
                />
            </div>
        </PickersDay>
    )
}

interface JobsCalendarProps {
    tab?: ProjectCenterTabEnum
    queryParams?: Partial<JobQueryInput>
}

function SidebarCalendar({
    tab = ProjectCenterTabEnum.ACTIVE,
    queryParams,
}: JobsCalendarProps) {
    const { isOpen, onClose, onOpen } = useDisclosure({ id: 'JobDueModal' })
    const [currentDate, setCurrentDate] = React.useState<string>('')
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
        <>
            <JobDueModal
                isOpen={isOpen}
                onClose={onClose}
                currentDate={currentDate}
            />

            <DateCalendar
                sx={{ width: '100%' }}
                loading={isLoading}
                onMonthChange={handleMonthChange}
                onChange={(value) => {
                    const dateString = dayjs(value)
                        .add(1, 'day')
                        .toISOString()
                        .split('T')[0]
                    setCurrentDate(dateString)
                    onOpen()
                }}
                renderLoading={() => <DayCalendarSkeleton />}
                slots={{ day: ServerDay }}
                slotProps={{
                    day: { highlightedDays } as Partial<ServerDayProps>,
                }}
            />
        </>
    )
}
export default React.memo(SidebarCalendar)
