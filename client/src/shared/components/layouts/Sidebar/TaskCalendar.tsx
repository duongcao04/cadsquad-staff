'use client'

import { Calendar } from '@/shared/components/ui/calendar'
import { useDisclosure } from '@heroui/react'
import * as React from 'react'
import { JobDueModal } from '../../modals'
import DayButton from './DayButton'

export default function TaskCalendar() {
    const { isOpen, onClose, onOpen } = useDisclosure({ id: 'JobDueModal' })
    const [date, setDate] = React.useState<Date | undefined>(undefined)

    // const isToday = dayjs(today).isSame('2025-11-10', 'date')
    // console.log(isToday)

    return (
        <>
            {date && (
                <JobDueModal
                    isOpen={isOpen}
                    onClose={onClose}
                    currentDate={date}
                />
            )}
            <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-lg size-full md:[--cell-size:--spacing(4)]"
                buttonVariant="ghost"
                animate={false}
                components={{
                    DayButton: ({ day }) => (
                        <DayButton
                            calendarDay={day}
                            openModal={onOpen}
                            selectedDate={date}
                            setSelectedDate={setDate}
                        />
                    ),
                }}
            />
        </>
    )
}
