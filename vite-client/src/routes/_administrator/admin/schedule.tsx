import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
    Card,
    Button,
    Avatar,
    Select,
    SelectItem,
    useDisclosure,
} from '@heroui/react'
import { ChevronLeft, ChevronRight, Filter, Plus, House } from 'lucide-react'
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths,
    parseISO,
} from 'date-fns'
import { Link } from '@tanstack/react-router'
import { INTERNAL_URLS } from '../../../lib'
import {
    AdminPageHeading,
    HeroBreadcrumbs,
    HeroBreadcrumbItem,
} from '../../../shared/components'
import AdminContentContainer from '../../../shared/components/admin/AdminContentContainer'
import JobScheduleModal from '../../../shared/components/admin-schedule/JobScheduleModal'
import { TJob } from '../../../shared/types'

export const Route = createFileRoute('/_administrator/admin/schedule')({
    component: SchedulePage,
})

// --- Types based on Prisma Schema ---
interface JobEvent {
    id: string
    title: string
    client: string
    dueAt: string // ISO String
    status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE' | 'URGENT'
    assignees: { name: string; avatar: string }[]
    hexColor?: string // Status color
}

// --- Mock Data ---
const MOCK_JOBS: JobEvent[] = [
    {
        id: '1',
        title: 'Website Redesign',
        client: 'TechCorp',
        dueAt: '2024-02-15T14:00:00',
        status: 'IN_PROGRESS',
        assignees: [
            { name: 'Sarah', avatar: 'https://i.pravatar.cc/150?u=sarah' },
            { name: 'David', avatar: 'https://i.pravatar.cc/150?u=david' },
        ],
        hexColor: '#3B82F6', // Blue
    },
    {
        id: '2',
        title: 'Mobile App Assets',
        client: 'Startup Inc',
        dueAt: '2024-02-15T10:00:00',
        status: 'URGENT',
        assignees: [
            { name: 'Sarah', avatar: 'https://i.pravatar.cc/150?u=sarah' },
        ],
        hexColor: '#EF4444', // Red
    },
    {
        id: '3',
        title: 'SEO Audit',
        client: 'RetailChain',
        dueAt: '2024-02-20T16:00:00',
        status: 'DONE',
        assignees: [
            { name: 'Alex', avatar: 'https://i.pravatar.cc/150?u=alex' },
        ],
        hexColor: '#10B981', // Green
    },
    {
        id: '4',
        title: 'Client Meeting',
        client: 'Amoovo',
        dueAt: '2024-02-05T09:00:00',
        status: 'TODO',
        assignees: [
            { name: 'James', avatar: 'https://i.pravatar.cc/150?u=james' },
        ],
        hexColor: '#94A3B8', // Slate
    },
    {
        id: '5',
        title: 'Logo Design',
        client: 'CoffeeShop',
        dueAt: '2024-02-08T11:00:00',
        status: 'REVIEW',
        assignees: [
            { name: 'Sarah', avatar: 'https://i.pravatar.cc/150?u=sarah' },
        ],
        hexColor: '#F59E0B', // Orange
    },
]

const TEAM_MEMBERS = [
    { id: 'all', name: 'All Members', avatar: '' },
    {
        id: 'sarah',
        name: 'Sarah Wilson',
        avatar: 'https://i.pravatar.cc/150?u=sarah',
    },
    {
        id: 'david',
        name: 'David Chen',
        avatar: 'https://i.pravatar.cc/150?u=david',
    },
]
function SchedulePage() {
    const [currentDate, setCurrentDate] = useState(new Date(2024, 1, 1)) // Start Feb 2024 for demo
    const [selectedMember, setSelectedMember] = useState<string>('all')
    const [selectedJob, setSelectedJob] = useState<JobEvent | null>(null)

    const {
        isOpen: isOpenJobScheduleModal,
        onOpen: onOpenJobScheduleModal,
        onClose: onCloseJobScheduleModal,
    } = useDisclosure({
        id: 'JobScheduleModal',
    })

    const handleOpenJobScheduleModal = (job: TJob) => {
        setSelectedJob(job)
        onOpenJobScheduleModal()
    }

    // --- Calendar Logic ---
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }) // Monday start
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 })

    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate })

    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

    // --- Navigation ---
    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))
    const goToToday = () => setCurrentDate(new Date())

    // --- Filtering ---
    const filteredJobs = MOCK_JOBS.filter((job) => {
        if (selectedMember === 'all') return true
        return job.assignees.some((a) =>
            a.name.toLowerCase().includes(selectedMember)
        )
    })

    const getJobsForDay = (date: Date) => {
        return filteredJobs.filter((job) =>
            isSameDay(parseISO(job.dueAt), date)
        )
    }

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
                {/* --- Header Toolbar --- */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 shrink-0">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center bg-white rounded-xl border border-border-default p-1 shadow-sm">
                            <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                onClick={prevMonth}
                            >
                                <ChevronLeft size={18} />
                            </Button>
                            <div className="px-4 font-bold text-slate-700 min-w-35 text-center">
                                {format(currentDate, 'MMMM yyyy')}
                            </div>
                            <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                onClick={nextMonth}
                            >
                                <ChevronRight size={18} />
                            </Button>
                        </div>

                        <Button variant="flat" onClick={goToToday}>
                            Today
                        </Button>

                        <Select
                            placeholder="Filter by Member"
                            className="w-48"
                            startContent={
                                <Filter size={16} className="text-slate-400" />
                            }
                            size="sm"
                            defaultSelectedKeys={['all']}
                            onChange={(e) => setSelectedMember(e.target.value)}
                        >
                            {TEAM_MEMBERS.map((m) => (
                                <SelectItem
                                    key={m.id}
                                    value={m.id}
                                    textValue={m.name}
                                >
                                    <div className="flex items-center gap-2">
                                        {m.avatar && (
                                            <Avatar src={m.avatar} size="xs" />
                                        )}
                                        <span>{m.name}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </Select>
                    </div>
                    <Button color="primary" startContent={<Plus size={16} />}>
                        New Job
                    </Button>
                </div>

                {/* --- Calendar Grid --- */}
                <Card className="flex-1 flex flex-col shadow-sm border border-border-default overflow-hidden">
                    {/* Weekday Headers */}
                    <div className="grid grid-cols-7 border-b border-border-default bg-background-muted shrink-0">
                        {weekDays.map((day) => (
                            <div
                                key={day}
                                className="py-3 text-center text-sm font-semibold text-text-subdued uppercase tracking-wider"
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Days Grid */}
                    <div className="flex-1 grid grid-cols-7 grid-rows-5 bg-slate-200 gap-px">
                        {calendarDays.map((day) => {
                            const isCurrentMonth = isSameMonth(day, monthStart)
                            const isToday = isSameDay(day, new Date())
                            const daysJobs = getJobsForDay(day)

                            return (
                                <div
                                    key={day.toISOString()}
                                    className={`
                          relative bg-background flex flex-col p-2 min-h-30 transition-colors
                          ${!isCurrentMonth ? 'dark:bg-text-8 bg-text-3 dark:text-slate-400 text-slate-500' : 'text-text-default'}
                          hover:bg-background-hovered hover:dark:bg-[#3d3d3d]
                        `}
                                >
                                    {/* Date Number */}
                                    <div className="flex justify-between items-start mb-2">
                                        <span
                                            className={`
                              text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full
                              ${isToday ? 'bg-primary text-text-default shadow-md shadow-primary/30' : ''}
                            `}
                                        >
                                            {format(day, 'd')}
                                        </span>
                                        {daysJobs.length > 0 && (
                                            <span className="text-[10px] font-bold text-text-default">
                                                {daysJobs.length} jobs
                                            </span>
                                        )}
                                    </div>

                                    {/* Events List */}
                                    <div className="flex-1 flex flex-col gap-1 overflow-y-auto max-h-30 custom-scrollbar">
                                        {daysJobs.map((job) => (
                                            <div
                                                key={job.id}
                                                onClick={() =>
                                                    handleOpenJobScheduleModal(
                                                        job
                                                    )
                                                }
                                                className="group flex items-center gap-2 p-1.5 rounded-lg text-xs font-medium cursor-pointer border border-transparent hover:border-border-default hover:shadow-sm transition-all bg-opacity-10"
                                                style={{
                                                    backgroundColor: `${job.hexColor}15`, // 15% opacity bg
                                                    color: job.hexColor,
                                                }}
                                            >
                                                <div
                                                    className="w-1.5 h-1.5 rounded-full shrink-0"
                                                    style={{
                                                        backgroundColor:
                                                            job.hexColor,
                                                    }}
                                                ></div>
                                                <span className="truncate flex-1">
                                                    {job.title}
                                                </span>

                                                {/* Hover Avatar Group */}
                                                <div className="hidden group-hover:flex -space-x-1">
                                                    {job.assignees.map(
                                                        (a, i) => (
                                                            <Avatar
                                                                key={i}
                                                                src={a.avatar}
                                                                className="w-4 h-4"
                                                            />
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* "Add" hint on hover */}
                                    {isCurrentMonth && (
                                        <Button
                                            isIconOnly
                                            size="sm"
                                            variant="light"
                                            className="absolute bottom-2 right-2 opacity-0 hover:opacity-100 transition-opacity text-slate-400"
                                        >
                                            <Plus size={14} />
                                        </Button>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </Card>

                {/* --- Event Detail Modal --- */}
                {isOpenJobScheduleModal && selectedJob && (
                    <JobScheduleModal
                        isOpen={isOpenJobScheduleModal}
                        onClose={onCloseJobScheduleModal}
                        selectedJob={selectedJob}
                    />
                )}
            </AdminContentContainer>
        </div>
    )
}
