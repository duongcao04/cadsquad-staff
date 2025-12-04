'use client'

import { PageHeading } from '@/shared/components'
import UserTableView from '@/shared/components/manage-team/UserTableView'
import { Badge } from '@heroui/react'
import { useTranslations } from 'next-intl'

export default function ManagementTeamPage() {
    const t = useTranslations()

    return (
        <>
            <PageHeading
                title={
                    <Badge color="danger" content="5">
                        <p className="pr-5 leading-none">
                            {t('settings.teamManagement')}
                        </p>
                    </Badge>
                }
                classNames={{
                    wrapper: 'w-full',
                }}
            />
            <div className="h-10">
                {/* <HeroButton
                    startContent={<Plus size={14} />}
                    size="sm"
                    color="primary"
                    variant="solid"
                    onPress={onOpenUserModal}
                >
                    {t('createUser')}
                </HeroButton> */}
            </div>
            <div className="w-full h-[calc(100%-54px-40px-12px)] bg-background rounded-md pr-3.5 overflow-y-auto overflow-x-hidden">
                <div className="size-full">
                    <UserTableView />
                </div>
            </div>
        </>
    )
}
