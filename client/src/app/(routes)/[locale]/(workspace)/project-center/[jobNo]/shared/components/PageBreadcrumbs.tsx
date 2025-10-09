'use client'

import { Link } from '@/i18n/navigation'
import { useJobByNo } from '@/shared/queries'
import { BreadcrumbItem, Breadcrumbs, Skeleton } from '@heroui/react'
import { HouseIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

type Props = { jobNo: string }
export function PageBreadcrumbs({ jobNo }: Props) {
    const t = useTranslations()
    const { job, isLoading } = useJobByNo(jobNo)

    return (
        <Breadcrumbs>
            <BreadcrumbItem>
                <Link href={'/'} title="Home" className="block">
                    <HouseIcon size={14} />
                </Link>
            </BreadcrumbItem>
            <BreadcrumbItem>
                <Link
                    href="/project-center"
                    title="Project Center"
                    className="block"
                >
                    {t('projectCenter')}
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
