'use client'

import { CreateUserModal, HeroButton, PageHeading } from '@/shared/components'
import { useUsers } from '@/lib/queries'
import { Badge, useDisclosure } from '@heroui/react'
import { Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { TeamTable } from './shared'

export default function ManagementTeamPage() {
    const t = useTranslations()
    const { users, isLoading: loadingUsers } = useUsers()
    const {
        isOpen: isOpenUserModal,
        onOpen: onOpenUserModal,
        onClose: onCloseUserModal,
    } = useDisclosure({
        id: 'CreateUserModal',
    })

    return (
        <>
            <CreateUserModal
                isOpen={isOpenUserModal}
                onClose={onCloseUserModal}
            />
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
            <div className="h-[40px]">
                <HeroButton
                    startContent={<Plus size={14} />}
                    size="sm"
                    color="primary"
                    variant="solid"
                    onPress={onOpenUserModal}
                >
                    {t('createUser')}
                </HeroButton>
            </div>
            <div className="w-full h-[calc(100%-54px-40px-12px)] bg-background rounded-md pr-3.5 overflow-y-auto overflow-x-hidden">
                <div className="size-full">
                    <TeamTable data={users ?? []} isLoading={loadingUsers} />
                </div>
            </div>
        </>
    )
}
