'use client'

import { Breadcrumbs, BreadcrumbItem, Skeleton } from '@heroui/react'
import { HouseIcon } from 'lucide-react'
import React from 'react'
import { useJobByNo } from '@/shared/queries/useJob'
import { Link } from '@/i18n/navigation'

type Props = { jobNo: string }
export default function PageBreadcrumbs({ jobNo }: Props) {
    const { job, isLoading } = useJobByNo(jobNo)

    return (
        <Breadcrumbs>
            <BreadcrumbItem>
                <Link href={'/'} title="Home" className="block">
                    <HouseIcon size={14} />
                </Link>
            </BreadcrumbItem>
            <BreadcrumbItem>
                <Link href="/onboarding" title="Onboarding" className="block">
                    Onboarding
                </Link>
            </BreadcrumbItem>
            <BreadcrumbItem>
                <Skeleton
                    className="w-fit h-fit rounded-md"
                    isLoaded={!isLoading}
                >
                    <p>{job?.displayName}</p>
                </Skeleton>
            </BreadcrumbItem>
        </Breadcrumbs>
    )
}
