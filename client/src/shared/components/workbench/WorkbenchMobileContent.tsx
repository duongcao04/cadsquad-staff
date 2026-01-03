import { Pagination } from '@heroui/react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { workbenchDataOptions } from '../../../lib/queries'
import { HeroInput } from '../ui/hero-input'
import JobMobileCard from './JobMobileCard'
import { useMemo } from 'react'
import lodash from 'lodash'
import { INTERNAL_URLS } from '../../../lib'
import { useRouter } from '@tanstack/react-router'

type Props = {
    onAssignMember: (jobNo: string) => void
    currentPage: number
    onPageChange: (newPage: number) => void
    search?: string
    onSearchChange: (newSearch?: string) => void
}
export default function WorkbenchMobileContent({
    onAssignMember,
    currentPage,
    search,
    onPageChange,
    onSearchChange,
}: Props) {
    const router = useRouter()
    const debouncedSearchChange = useMemo(
        () => lodash.debounce((value: string) => onSearchChange(value), 500),
        [onSearchChange]
    )
    const {
        data: { jobs, paginate },
    } = useSuspenseQuery({
        ...workbenchDataOptions({
            page: currentPage,
            search: search,
        }),
    })
    return (
        <div className="md:hidden space-y-4 pb-20">
            {/* Search/Sort Controls for Mobile */}
            <div className="flex flex-col gap-3 mb-4">
                <HeroInput
                    placeholder="Search jobs..."
                    isClearable
                    onValueChange={(val) => {
                        if (!val)
                            onSearchChange(undefined) // Instant reset on clear
                        else debouncedSearchChange(val)
                    }}
                />
            </div>
            {jobs.map((job) => (
                <JobMobileCard
                    key={job.no}
                    job={job}
                    onViewDetail={() => {
                        router.navigate({
                            href: INTERNAL_URLS.getJobDetailUrl(job.no),
                        })
                    }}
                    onAssignMember={onAssignMember}
                />
            ))}

            {/* Mobile Pagination */}
            <div className="flex justify-center pt-4">
                <Pagination
                    total={paginate?.totalPages ?? 1}
                    page={currentPage}
                    onChange={onPageChange}
                />
            </div>
        </div>
    )
}
