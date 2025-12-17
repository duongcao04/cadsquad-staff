import dayjs from 'dayjs'
import lodash from 'lodash'

import { CalendarDay } from 'react-day-picker'

import { useJobsDueOnDate } from '@/lib/queries'

type Props = {
    selectedDate: Date | undefined
    setSelectedDate: React.Dispatch<React.SetStateAction<Date | undefined>>
    calendarDay: CalendarDay
    openModal: () => void
}

export default function DayButton({
    selectedDate,
    setSelectedDate,
    calendarDay,
    openModal,
}: Props) {
    const { data: jobs } = useJobsDueOnDate(calendarDay.date?.toISOString())
    // eslint-disable-next-line react-hooks/purity
    const today = new Date(Date.now())
    const isSelected = lodash.isEqual(selectedDate, calendarDay.date)
    const isToday = dayjs(today).isSame(calendarDay.date, 'date')
    const isHighlight = Boolean(jobs?.length)

    return (
        <button
            onClick={() => {
                setSelectedDate(calendarDay.date)
                openModal()
            }}
            className="size-full flex flex-col items-center justify-center gap-1 rounded-full cursor-pointer hover:bg-primary-100 transition-colors duration-100"
            style={{
                border: '1px solid',
                borderColor: isToday ? '--background' : 'transparent',
                backgroundColor: isSelected
                    ? 'var(--primary)'
                    : isToday
                      ? 'var(--color-primary-100)'
                      : 'transparent',
            }}
        >
            <p
                className="text-xs"
                style={{
                    color: isSelected ? 'white' : 'black',
                }}
            >
                {calendarDay.date.getDate().toString()}
            </p>
            <div
                className="size-1 rounded-full"
                style={{
                    backgroundColor: isHighlight ? 'red' : 'transparent',
                }}
            />
        </button>
    )
}
