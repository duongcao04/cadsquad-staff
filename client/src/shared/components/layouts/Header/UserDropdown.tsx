'use client'

import { usePathname, useRouter } from '@/i18n/navigation'
import { useLogout, useProfile } from '@/shared/queries'
import {
    addToast,
    Avatar,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownSection,
    DropdownTrigger,
    User as UserComp,
} from '@heroui/react'
import { LogOut, User, UserCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function UserDropdown() {
    const tSettings = useTranslations('settings')
    const tCommon = useTranslations()

    const pathname = usePathname()
    const router = useRouter()
    const { profile, accessToken } = useProfile()
    const { mutateAsync: logoutMutate } = useLogout()

    const handleLogout = async () => {
        logoutMutate(accessToken, {
            onSuccess() {
                addToast({
                    title: 'Logout successfully!',
                    color: 'success',
                })
                router.push({
                    pathname: '/auth',
                    query: { redirect: pathname },
                })
            },
            onError(error) {
                addToast({
                    title: 'Logout failed!',
                    description: `${error}`,
                    color: 'danger',
                })
            },
        })
    }

    return (
        <Dropdown
            showArrow
            classNames={{
                base: 'before:bg-default-200',
                content: 'p-0 border-small border-divider bg-background',
            }}
            radius="sm"
            placement="bottom-end"
        >
            <DropdownTrigger>
                <Avatar
                    isBordered
                    className="cursor-pointer"
                    color="danger"
                    icon={<User size={18} />}
                    src={profile?.avatar ?? ''}
                    classNames={{
                        base: '!size-6',
                    }}
                    size="sm"
                    suppressHydrationWarning
                />
            </DropdownTrigger>
            <DropdownMenu aria-label="User menu" className="p-3">
                <DropdownSection showDivider aria-label="Profile">
                    <DropdownItem
                        key="profile"
                        className="h-14 gap-2 opacity-100"
                        onClick={() => {
                            router.push('/profile')
                        }}
                    >
                        <UserComp
                            avatarProps={{
                                size: 'sm',
                                src: profile?.avatar ?? '',
                            }}
                            classNames={{
                                name: 'text-default-600',
                                description: 'text-default-500',
                            }}
                            name={profile?.displayName}
                            description={`@${profile?.username}`}
                        />
                    </DropdownItem>
                    <DropdownItem
                        key="overview"
                        onClick={() => {
                            router.push('/overview')
                        }}
                    >
                        {tCommon('overview')}
                    </DropdownItem>
                    <DropdownItem
                        key="settings"
                        onClick={() => {
                            router.push('/setting')
                        }}
                    >
                        {tSettings('accountSettings')}
                    </DropdownItem>
                </DropdownSection>

                <DropdownSection aria-label="Help & Settings">
                    <DropdownItem
                        key="helpCenter"
                        startContent={<UserCircle size={16} />}
                        onClick={() => {
                            router.push('/help-center')
                        }}
                    >
                        {tCommon('helpCenter')}
                    </DropdownItem>
                    <DropdownItem
                        key="logout"
                        startContent={<LogOut size={16} />}
                        color="danger"
                        onPress={handleLogout}
                    >
                        {tCommon('logout')}
                    </DropdownItem>
                </DropdownSection>
            </DropdownMenu>
        </Dropdown>
    )
}
