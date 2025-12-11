'use client'

import { Link } from '@/i18n/navigation'
import { INTERNAL_URLS } from '@/lib/utils'
import UserTableView from '@/shared/components/manage-team/UserTableView'
import {
    HeroBreadcrumbItem,
    HeroBreadcrumbs,
} from '@/shared/components/ui/hero-breadcrumbs'
import { Spacer } from '@heroui/react'
import { House } from 'lucide-react'

export default function ManagementTeamPage() {
    return (
        <>
            <HeroBreadcrumbs className="pt-4! pb-3! pl-6 pr-3.5">
                <HeroBreadcrumbItem>
                    <Link
                        href={INTERNAL_URLS.home}
                        className="text-text-subdued!"
                    >
                        <House size={16} />
                    </Link>
                </HeroBreadcrumbItem>
                <HeroBreadcrumbItem>
                    <Link
                        href={INTERNAL_URLS.projectCenter}
                        className="text-text-subdued!"
                    >
                        Admin settings
                    </Link>
                </HeroBreadcrumbItem>
                <HeroBreadcrumbItem>Team</HeroBreadcrumbItem>
            </HeroBreadcrumbs>

            <Spacer className="h-1" />

            <div className="pl-5 pr-3.5">
                <UserTableView />
            </div>
        </>
    )
}
