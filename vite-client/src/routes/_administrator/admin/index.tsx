import { useProfile } from '@/lib'
import { analyticsOverviewOptions } from '@/lib/queries/options/analytics-queries'
import { HeroButton } from '@/shared/components'
import { RevenueChart } from '@/shared/components/admin/charts/RevenueChart'
import { TopPerformers } from '@/shared/components/admin/charts/TopPerformers'
import { TopStats } from '@/shared/components/admin/charts/TopStats'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Plus } from 'lucide-react'

export const Route = createFileRoute('/_administrator/admin/')({
    loader: ({ context }) => {
        return context.queryClient.ensureQueryData(analyticsOverviewOptions({}))
    },
    component: AdminDashboardPage,
})

function AdminDashboardPage() {
    const { profile } = useProfile()

    const {
        data: {
            cards: { activeJobs, overdue, pendingReview, waitingPayment },
            financialChart: { data: financialChart },
            topPerformers,
        },
    } = useSuspenseQuery(analyticsOverviewOptions({}))

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
                    <div className="hidden md:flex items-center gap-2 bg-background-hovered px-3 py-2 rounded-lg border border-border-default text-text-subdued text-sm">
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
                    activeJobs={activeJobs}
                    overdueJobs={overdue}
                    pendingReview={pendingReview}
                    waitingPayment={waitingPayment}
                />
                <RevenueChart data={financialChart} />
                <TopPerformers data={topPerformers} />
            </div>
        </main>
    )
}
