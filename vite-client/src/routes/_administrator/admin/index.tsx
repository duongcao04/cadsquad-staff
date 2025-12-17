import { createFileRoute } from '@tanstack/react-router'

import { Plus } from 'lucide-react'
import { RevenueChart } from '../../../shared/components/admin/charts/RevenueChart'
import { TopPerformers } from '../../../shared/components/admin/charts/TopPerformers'
import { TopStats } from '../../../shared/components/admin/charts/TopStats'
import { HeroButton } from '../../../shared/components'
import { useProfile } from '../../../lib'
import { jobsListOptions } from '../../../lib/queries'
import { useSuspenseQuery } from '@tanstack/react-query'

export const Route = createFileRoute('/_administrator/admin/')({
    loader: ({ context }) => {
        return context.queryClient.ensureQueryData(
            jobsListOptions({
                limit: 10,
                page: 1,
                tab: 'active',
                hideFinishItems: '1',
            })
        )
    },

    component: AdminDashboard,
})

// --- Types based on your Prisma Schema (Simplified for Frontend) ---
type DashboardData = {
    user: {
        displayName: string
        role: string
    }
    stats: {
        totalRevenue: number
        profit: number
        activeJobs: number
        completedJobs: number
    }
    statusDistribution: { name: string; value: number; color: string }[]
    topStaff: {
        id: string
        name: string
        role: string
        points: number
        avatar: string
    }[]
    urgentJobs: { id: string; title: string; dueAt: string; priority: string }[]
    recentJobs: {
        id: string
        no: string
        title: string
        client: string
        status: string
        statusColor: string
        assigneeAvatar: string
    }[]
}

// --- Mock Data (Replace with API fetch) ---
const mockData: DashboardData = {
    user: { displayName: 'Cao Hải Dương', role: 'Admin' },
    stats: {
        totalRevenue: 15400,
        profit: 4200, // Income - StaffCost
        activeJobs: 16,
        completedJobs: 80,
    },
    statusDistribution: [
        { name: 'Done', value: 84, color: '#8B5CF6' }, // Violet
        { name: 'Review', value: 4, color: '#F59E0B' }, // Amber
        { name: 'In Progress', value: 8, color: '#3B82F6' }, // Blue
        { name: 'To Do', value: 4, color: '#E5E7EB' }, // Gray
    ],
    topStaff: [
        {
            id: '1',
            name: 'Arif Brata',
            role: 'Fullstack Dev',
            points: 100,
            avatar: 'https://i.pravatar.cc/150?u=1',
        },
        {
            id: '2',
            name: 'Ardhi Irwandi',
            role: 'Senior Designer',
            points: 80,
            avatar: 'https://i.pravatar.cc/150?u=2',
        },
        {
            id: '3',
            name: 'Friza Dipa',
            role: 'Project Manager',
            points: 100,
            avatar: 'https://i.pravatar.cc/150?u=3',
        },
    ],
    urgentJobs: [
        {
            id: '1',
            title: 'Fix API Gateway Timeout',
            dueAt: 'Tomorrow',
            priority: 'URGENT',
        },
        {
            id: '2',
            title: 'Update HR Dashboard',
            dueAt: 'Fri, 12 Oct',
            priority: 'HIGH',
        },
        {
            id: '3',
            title: 'Client Meeting: Amoovo',
            dueAt: 'Today',
            priority: 'HIGH',
        },
    ],
    recentJobs: [
        {
            id: '1',
            no: 'FV-1023',
            title: 'E-commerce Redesign',
            client: 'TechCorp',
            status: 'In Progress',
            statusColor: 'bg-blue-100 text-blue-600',
            assigneeAvatar: 'https://i.pravatar.cc/150?u=1',
        },
        {
            id: '2',
            no: 'FV-1024',
            title: 'Mobile App API',
            client: 'StartUp Inc',
            status: 'Review',
            statusColor: 'bg-yellow-100 text-yellow-600',
            assigneeAvatar: 'https://i.pravatar.cc/150?u=2',
        },
        {
            id: '3',
            no: 'FV-1025',
            title: 'SEO Audit',
            client: 'RetailChain',
            status: 'Done',
            statusColor: 'bg-green-100 text-green-600',
            assigneeAvatar: 'https://i.pravatar.cc/150?u=3',
        },
    ],
}

function AdminDashboard() {
    const { profile } = useProfile()

    const {
        data: activeJobs,
        refetch,
        isFetching: isLoadingActiveJobs,
    } = useSuspenseQuery(
        jobsListOptions({
            limit: 10,
            page: 1,
            tab: 'active',
            hideFinishItems: '1',
        })
    )
    const { data: overdueJobs } = useSuspenseQuery(
        jobsListOptions({
            limit: 10,
            page: 1,
            tab: 'late',
            hideFinishItems: '1',
        })
    )

    return (
        <main className="flex-1 p-8">
            {/* Header */}
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-xl font-semibold text-text-default">
                        Welcome Back, {profile.displayName} 👋
                    </h1>
                    <p className="text-text-subdued text-sm mt-1">
                        Your Team's Success Starts Here. Let's Make Progress
                        Together!
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 text-slate-500 text-sm">
                        <span>1 Nov - 7 Nov 2024</span>
                    </div>
                    <HeroButton startContent={<Plus className="w-4 h-4" />}>
                        Add Job
                    </HeroButton>
                </div>
            </header>

            {/* Content Flow */}
            <div className="space-y-5">
                <TopStats
                    activeJobs={activeJobs.paginate?.total ?? 0}
                    overdueJobs={overdueJobs.paginate?.total ?? 0}
                    pendingReview={12}
                />
                <RevenueChart />
                <TopPerformers />
            </div>
        </main>
    )
}
