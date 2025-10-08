'use client'

import React from 'react'
import TeamTable from './shared/components/TeamTable'
import { useUsers } from '@/shared/queries/useUser'
import PageHeading from '@/shared/components/layouts/PageHeading'
import { useTranslations } from 'next-intl'
import { Badge } from '@heroui/react'

export default function ManagementTeamPage() {
    const t = useTranslations('settings')
    const { users, isLoading: loadingUsers } = useUsers()

    return (
        <>
            <PageHeading
                title={
                    <Badge color="primary" content="5">
                        <p className="pr-5 leading-none">
                            {t('teamManagement')}
                        </p>
                    </Badge>
                }
                classNames={{
                    wrapper: 'w-full',
                }}
            />
            <div className="w-full h-[calc(100%-54px-12px)] bg-background rounded-md pr-3.5 overflow-y-auto overflow-x-hidden">
                <div className="size-full">
                    <TeamTable data={users ?? []} isLoading={loadingUsers} />
                </div>
            </div>
        </>
    )
}
