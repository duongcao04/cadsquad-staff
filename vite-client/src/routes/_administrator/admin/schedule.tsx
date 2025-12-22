import { getPageTitle, INTERNAL_URLS } from '@/lib'
import { jobScheduleOptions } from '@/lib/queries/options/job-queries'
import {
    AdminPageHeading,
    HeroBreadcrumbItem,
    HeroBreadcrumbs,
} from '@/shared/components'
import JobScheduleModal from '@/shared/components/admin-schedule/JobScheduleModal'
import AdminContentContainer from '@/shared/components/admin/AdminContentContainer'
import { Badge, Button, Card, useDisclosure } from '@heroui/react'
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
import { useMemo, useState } from 'react'

export const Route = createFileRoute('/_administrator/admin/schedule')({
    head: () => ({
        meta: [
            {
                title: getPageTitle('Schedule'),
            },
        ],
    }),
    component: SchedulePage,
})

function SchedulePage() {
    // 1. Manage Month State
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedMember] = useState<string>('all')
    const [selectedJob, setSelectedJob] = useState<string | null>(null)

    // 2. Fetch API Data for the current month
    const month = currentDate.getMonth() + 1
    const year = currentDate.getFullYear()

    const { data: jobsSchedule, isFetching } = useSuspenseQuery(
        jobScheduleOptions(month, year)
    )

    const {
        isOpen: isOpenJobScheduleModal,
        onOpen: onOpenJobScheduleModal,
        onClose: onCloseJobScheduleModal,
    } = useDisclosure()

    const handleOpenJobScheduleModal = (jobNo: string) => {
        setSelectedJob(jobNo)
        onOpenJobScheduleModal()
    }

    // --- Calendar Calculation ---
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 })
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 })
    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate })
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

    // --- Navigation ---
    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))
    const goToToday = () => setCurrentDate(new Date())

    // --- Filtering Logic ---
    const filteredJobs = useMemo(() => {
        if (selectedMember === 'all') return jobsSchedule
        return jobsSchedule.filter((job) =>
            job.assignee?.some((a: any) => a.id === selectedMember)
        )
    }, [jobsSchedule, selectedMember])

    const getJobsForDay = (date: Date) => {
        return filteredJobs.filter((job) =>
            isSameDay(new Date(job.dueAt), date)
        )
    }

    return (
        <div
            className={
                isFetching
                    ? 'opacity-70 pointer-events-none transition-opacity'
                    : ''
            }
        >
            <AdminPageHeading
                title={
                    <Badge
                        content={jobsSchedule.length}
                        size="sm"
                        color="danger"
                        variant="solid"
                        classNames={{
                            badge: '-right-1 top-1 text-[10px]! font-bold!',
                        }}
                    >
                        Schedule
                    </Badge>
                }
            />

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
                {/* --- Toolbar --- */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 shrink-0">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center bg-background-hovered rounded-xl border border-border-default p-1 shadow-sm">
                            <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                onClick={prevMonth}
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
                                onPress={nextMonth}
                            >
                                <ChevronRight size={18} />
                            </Button>
                        </div>
                        <Button variant="flat" onClick={goToToday}>
                            Today
                        </Button>
                    </div>

                    <Button color="primary" startContent={<Plus size={16} />}>
                        New Job
                    </Button>
                </div>

                {/* --- Calendar Grid --- */}
                <Card className="flex-1 flex flex-col shadow-sm border border-border-default overflow-hidden">
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
                                    className={`
                                        relative bg-background flex flex-col p-2 min-h-32 transition-colors
                                        ${!isCurrentMonth ? 'bg-background-hovered/30 text-text-subdued' : 'text-text-subdued'}
                                        hover:bg-background-hovered
                                    `}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span
                                            className={`
                                            text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full
                                            ${isToday ? 'bg-primary text-white' : ''}
                                        `}
                                        >
                                            {format(day, 'd')}
                                        </span>
                                    </div>

                                    <div className="flex-1 flex flex-col gap-1 overflow-y-auto max-h-32 scrollbar-hide">
                                        {daysJobs.map((job) => (
                                            <div
                                                key={job.id}
                                                onClick={() =>
                                                    handleOpenJobScheduleModal(
                                                        job.no
                                                    )
                                                }
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
                </Card>

                {isOpenJobScheduleModal && selectedJob && (
                    <JobScheduleModal
                        isOpen={isOpenJobScheduleModal}
                        onClose={onCloseJobScheduleModal}
                        jobNo={selectedJob}
                    />
                )}
            </AdminContentContainer>
        </div>
    )
}
