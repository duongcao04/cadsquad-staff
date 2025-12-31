import { Button, Skeleton, useDisclosure } from '@heroui/react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
    addMonths,
    eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    format,
    isSameDay,
    isSameMonth,
    startOfMonth,
    startOfWeek,
    subMonths,
} from 'date-fns'
import { ChevronLeft, ChevronRight, House, Plus } from 'lucide-react'
import { useState } from 'react'
import { getPageTitle, INTERNAL_URLS } from '@/lib'
import { jobScheduleOptions } from '@/lib/queries/options/job-queries'
import {
    AdminPageHeading,
    HeroBreadcrumbItem,
    HeroBreadcrumbs,
    HeroCard,
} from '@/shared/components'
import AdminContentContainer from '@/shared/components/admin/AdminContentContainer'
import JobScheduleModal from '@/shared/components/admin-schedule/JobScheduleModal'
import { TJob } from '../../../shared/types'

export const Route = createFileRoute('/_administrator/admin/schedule')({
    head: () => ({
        meta: [
            {
                title: getPageTitle('Schedule'),
            },
        ],
    }), // ✅ Router sẽ hiển thị cái này khi useSuspenseQuery đang fetch
    pendingComponent: () => (
        <ScheduleLayout>
            <CalendarSkeleton />
        </ScheduleLayout>
    ),
    // ✅ Hiển thị cái này nếu API bị lỗi
    errorComponent: ({ error }) => (
        <div className="p-10 text-center text-danger">
            Error loading schedule: {error.message}
        </div>
    ),
    component: () => (
        <ScheduleLayout>
            <SchedulePage />
        </ScheduleLayout>
    ),
})

function ScheduleLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <AdminPageHeading title="Schedule" />

            <HeroBreadcrumbs className="pt-3 px-7 text-xs">
                <HeroBreadcrumbItem>
                    <Link
                        to={INTERNAL_URLS.home}
                        className="text-text-subdued!"
                    >
                        <House size={16} />
                    </Link>
                </HeroBreadcrumbItem>
                <HeroBreadcrumbItem>
                    <Link
                        to={INTERNAL_URLS.admin}
                        className="text-text-subdued!"
                    >
                        Admin
                    </Link>
                </HeroBreadcrumbItem>
                <HeroBreadcrumbItem>Schedule</HeroBreadcrumbItem>
            </HeroBreadcrumbs>

            <AdminContentContainer className="mt-1">
                {children}
            </AdminContentContainer>
        </div>
    )
}
function SchedulePage() {
    // 1. Manage Month State
    const [currentDate, setCurrentDate] = useState(new Date())

    // 2. Fetch API Data for the current month
    const month = currentDate.getMonth() + 1
    const year = currentDate.getFullYear()

    const { data: jobsSchedule, isFetching } = useSuspenseQuery(
        jobScheduleOptions(month, year)
    )

    return (
        <div
            className={
                isFetching
                    ? 'opacity-70 pointer-events-none transition-opacity'
                    : ''
            }
        >
            <CalendarContent
                currentDate={currentDate}
                setCurrentDate={setCurrentDate}
                jobsSchedule={jobsSchedule}
            />
        </div>
    )
}

function CalendarContent({
    currentDate,
    setCurrentDate,
    jobsSchedule,
}: {
    currentDate: Date
    setCurrentDate: (d: Date) => void
    jobsSchedule: TJob[]
}) {
    const [selectedJob, setSelectedJob] = useState<string | null>(null)
    const { isOpen, onOpen, onClose } = useDisclosure()

    // --- Calendar Calculation ---
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 })
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 })
    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate })
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

    const getJobsForDay = (date: Date) => {
        return jobsSchedule.filter((job) =>
            isSameDay(new Date(job.dueAt), date)
        )
    }

    return (
        <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 shrink-0">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center bg-background-hovered rounded-xl border border-border-default p-1 shadow-sm">
                        <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            onClick={() =>
                                setCurrentDate(subMonths(currentDate, 1))
                            }
                        >
                            <ChevronLeft size={18} />
                        </Button>
                        <div className="px-4 font-bold text-text-default min-w-35 text-center">
                            {format(currentDate, 'MMMM yyyy')}
                        </div>
                        <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            onClick={() =>
                                setCurrentDate(addMonths(currentDate, 1))
                            }
                        >
                            <ChevronRight size={18} />
                        </Button>
                    </div>
                    <Button
                        variant="flat"
                        onClick={() => setCurrentDate(new Date())}
                    >
                        Today
                    </Button>
                </div>
                <Button color="primary" startContent={<Plus size={16} />}>
                    New Job
                </Button>
            </div>

            <HeroCard className="flex-1 flex flex-col shadow-sm border border-border-default overflow-hidden">
                <div className="grid grid-cols-7 border-b border-border-default bg-background-muted shrink-0">
                    {weekDays.map((day) => (
                        <div
                            key={day}
                            className="py-3 text-center text-xs font-bold text-text-default uppercase"
                        >
                            {day}
                        </div>
                    ))}
                </div>

                <div className="flex-1 grid grid-cols-7 bg-background-muted gap-px">
                    {calendarDays.map((day) => {
                        const isCurrentMonth = isSameMonth(day, monthStart)
                        const isToday = isSameDay(day, new Date())
                        const daysJobs = getJobsForDay(day)

                        return (
                            <div
                                key={day.toISOString()}
                                className={`relative bg-background flex flex-col p-2 min-h-32 hover:bg-background-hovered transition-colors ${!isCurrentMonth ? 'opacity-40' : ''}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span
                                        className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-primary text-white' : 'text-text-subdued'}`}
                                    >
                                        {format(day, 'd')}
                                    </span>
                                </div>
                                <div className="flex-1 flex flex-col gap-1 overflow-y-auto max-h-32 scrollbar-hide">
                                    {daysJobs.map((job) => (
                                        <div
                                            key={job.id}
                                            onClick={() => {
                                                setSelectedJob(job.no)
                                                onOpen()
                                            }}
                                            className="group flex items-center gap-2 p-1.5 rounded-md text-[11px] font-semibold cursor-pointer border border-transparent hover:border-border-default hover:shadow-sm transition-all"
                                            style={{
                                                backgroundColor: `${job.status?.hexColor}15`,
                                                color:
                                                    job.status?.hexColor ||
                                                    '#334155',
                                                borderLeft: `3px solid ${job.status?.hexColor}`,
                                            }}
                                        >
                                            <span className="truncate flex-1">
                                                {job.displayName}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </HeroCard>

            {isOpen && selectedJob && (
                <JobScheduleModal
                    isOpen={isOpen}
                    onClose={onClose}
                    jobNo={selectedJob}
                />
            )}
        </>
    )
}

function CalendarSkeleton() {
    return (
        <div className="flex flex-col h-full animate-pulse">
            <div className="flex justify-between mb-6">
                <Skeleton className="w-48 h-10 rounded-xl" />
                <Skeleton className="w-32 h-10 rounded-xl" />
            </div>
            <HeroCard className="flex-1 border border-border-default">
                <div className="grid grid-cols-7 border-b border-border-default h-12">
                    {[...Array(7)].map((_, i) => (
                        <div key={i} className="p-3">
                            <Skeleton className="h-4 w-full rounded-md" />
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 h-full gap-px bg-border-default">
                    {[...Array(35)].map((_, i) => (
                        <div
                            key={i}
                            className="bg-background p-2 min-h-32 space-y-2"
                        >
                            <Skeleton className="w-6 h-6 rounded-full" />
                            <Skeleton className="w-full h-4 rounded-md" />
                            <Skeleton className="w-4/5 h-4 rounded-md" />
                        </div>
                    ))}
                </div>
            </HeroCard>
        </div>
    )
}
