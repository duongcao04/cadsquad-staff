'use client'

import { usePathname, useRouter } from '@/i18n/navigation'
import { useLogout, useProfile } from '@/lib/queries'
import {
    addToast,
    Avatar,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownSection,
    DropdownTrigger,
    Select,
    SelectItem,
    User as UserComp,
} from '@heroui/react'
import {
    ChartArea,
    LogOut,
    SunMoon,
    User,
    UserCircle,
    UserCog,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { THEME_SELECTS } from '../../../../lib/utils'
import { useTheme } from 'next-themes'

export function UserDropdown() {
    const tSettings = useTranslations('settings')
    const tCommon = useTranslations()

    const { theme, setTheme } = useTheme()

    const pathname = usePathname()
    const router = useRouter()
    const { profile } = useProfile()
    const { mutateAsync: logoutMutate } = useLogout()

    const handleLogout = async () => {
        logoutMutate().then(() => {
            addToast({
                title: 'Logout successfully!',
                color: 'success',
            })
            router.push({
                pathname: '/auth',
                query: { redirect: pathname },
            })
        })
    }

    return (
        <Dropdown
            placement="bottom-end"
            showArrow
            classNames={{
                base: 'top-2',
                content: 'rounded-lg',
            }}
        >
            <DropdownTrigger>
                <Avatar
                    className="cursor-pointer"
                    icon={<User size={18} />}
                    src={profile.avatar}
                    classNames={{
                        base: '!size-6',
                    }}
                    size="sm"
                    suppressHydrationWarning
                />
            </DropdownTrigger>
            <DropdownMenu
                aria-label="User menu"
                classNames={{
                    base: 'min-w-[250px] overflow-y-auto',
                }}
                // disabledKeys={['changeTheme']}
            >
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
                                name: 'text-text-default font-medium',
                                description: 'text-text-subdued',
                            }}
                            name={profile.displayName}
                            description={`@${profile?.username}`}
                        />
                    </DropdownItem>
                    <DropdownItem
                        key="overview"
                        startContent={<ChartArea size={16} />}
                        onClick={() => {
                            router.push('/overview')
                        }}
                    >
                        {tCommon('overview')}
                    </DropdownItem>
                    <DropdownItem
                        key="settings"
                        startContent={<UserCog size={16} />}
                        onClick={() => {
                            router.push('/setting')
                        }}
                    >
                        {tSettings('accountSettings')}
                    </DropdownItem>
                </DropdownSection>

                <DropdownSection aria-label="Other actions" showDivider>
                    <DropdownItem
                        isReadOnly
                        key="changeTheme"
                        startContent={<SunMoon size={16} />}
                        className="hover:!bg-transparent"
                        endContent={
                            <Select
                                className="max-w-[100px]"
                                size="sm"
                                defaultSelectedKeys={[theme as 'dark']}
                                onSelectionChange={(keys) => {
                                    setTheme(keys.currentKey as 'dark')
                                }}
                            >
                                {THEME_SELECTS.map((theme) => (
                                    <SelectItem key={theme.key}>
                                        {theme.label}
                                    </SelectItem>
                                ))}
                            </Select>
                        }
                    >
                        Theme mode
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
