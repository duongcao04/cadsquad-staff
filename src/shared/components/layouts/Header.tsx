'use client'

import React, { useState } from 'react'

import {
    Avatar,
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownSection,
    DropdownTrigger,
    Kbd,
    User as UserComp,
    addToast,
    useDisclosure,
} from '@heroui/react'
import { Layout } from 'antd'
import {
    Bell,
    HelpCircle,
    LogOut,
    Search,
    Settings,
    User,
    UserCircle,
} from 'lucide-react'
import { useLocale } from 'next-intl'
import { useKeyboardShortcuts } from 'use-keyboard-shortcuts'

import AppLoader from '@/app/[locale]/loading'
import { usePathname, useRouter } from '@/i18n/navigation'
import { logoutSession } from '@/lib/auth/session'
import { supabase } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/zustand/useAuthStore'

import CadsquadLogo from '../CadsquadLogo'
import SearchModal from './SearchModal'

const { Header: AntHeader } = Layout

const Header = () => {
    const locale = useLocale()
    const router = useRouter()
    const pathname = usePathname()

    const { isOpen, onClose, onOpen } = useDisclosure()

    const [isLoading, setLoading] = useState(false)

    const authUser = useAuthStore((state) => state.authUser)
    const { removeAuthUser } = useAuthStore()

    useKeyboardShortcuts([
        {
            keys: ['ctrl', 'K'],
            onEvent: () => onOpen(),
        },
    ])

    const handleLogout = async () => {
        try {
            setLoading(true)
            await supabase.auth.signOut()
            await logoutSession(authUser)
            removeAuthUser()
            addToast({
                title: 'Logout successfully!',
                color: 'success',
            })
            router.push({
                pathname: `${locale}/auth`,
                query: { redirect: pathname },
            })
        } catch (error) {
            addToast({
                title: 'Logout failed!',
                description: `${error}`,
                color: 'danger',
            })
        } finally {
            setLoading(false)
        }
    }

    if (isLoading) return <AppLoader />

    return (
        <AntHeader
            style={{
                background: 'var(--color-secondary)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                padding: 0,
                overflow: 'hidden',
                height: '60px',
            }}
        >
            {/* Logo */}
            <div className="h-full container grid grid-cols-[130px_1fr_220px] gap-5 items-center place-items-center">
                <CadsquadLogo
                    classNames={{
                        logo: 'h-10',
                    }}
                    logoTheme="white"
                />

                {/* Search bar */}
                {/* <Input
                    placeholder="Search every thing"
                    startContent={<Search size={16} color="#999" />}
                    size="md"
                    radius="full"
                    classNames={{
                        base: 'w-[450px]',
                    }}
                    endContent={<Kbd keys={['command']}>K</Kbd>}
                /> */}
                <Button
                    startContent={<Search size={16} color="#999" />}
                    size="md"
                    radius="full"
                    variant="bordered"
                    className="bg-white"
                    onPress={onOpen}
                >
                    <p className="pr-[200px]">Search every thing</p>
                    <Kbd
                        keys={['ctrl']}
                        onKeyDown={() => {
                            onOpen()
                        }}
                    >
                        K
                    </Kbd>
                </Button>
                <SearchModal isOpen={isOpen} onClose={onClose} />

                {/* Right actions */}
                <div className="flex justify-end items-center gap-4">
                    <div className="flex items-center justify-end gap-3">
                        {/* Notification Bell */}
                        <Button
                            variant="light"
                            startContent={<Bell size={22} color="white" />}
                            isIconOnly
                            onPress={() => console.log('Notifications clicked')}
                        />

                        {/* Settings */}
                        <Button
                            variant="light"
                            startContent={<Settings size={22} color="white" />}
                            isIconOnly
                            onPress={() => console.log('Settings clicked')}
                        />

                        {/* Help */}
                        <Button
                            variant="light"
                            startContent={
                                <HelpCircle size={22} color="white" />
                            }
                            isIconOnly
                            onPress={() => console.log('Help clicked')}
                        />
                    </div>

                    <div />

                    {/* User Avatar with Dropdown */}
                    <Dropdown
                        showArrow
                        classNames={{
                            base: 'before:bg-default-200', // change arrow background
                            content:
                                'p-0 border-small border-divider bg-background',
                        }}
                        radius="sm"
                    >
                        <DropdownTrigger>
                            <Avatar
                                isBordered
                                className="cursor-pointer"
                                color="danger"
                                icon={<User size={18} />}
                                src={authUser?.avatar}
                                classNames={{
                                    base: 'size-9',
                                }}
                            />
                        </DropdownTrigger>
                        <DropdownMenu aria-label="User menu" className="p-3">
                            <DropdownSection showDivider aria-label="Profile">
                                <DropdownItem
                                    key="profile"
                                    className="h-14 gap-2 opacity-100"
                                    hrefLang={locale}
                                    href="/profile"
                                >
                                    <UserComp
                                        avatarProps={{
                                            size: 'sm',
                                            src: authUser?.avatar,
                                        }}
                                        classNames={{
                                            name: 'text-default-600',
                                            description: 'text-default-500',
                                        }}
                                        name={authUser?.name}
                                        description={`@${authUser?.username}`}
                                    />
                                </DropdownItem>
                                <DropdownItem
                                    key="onBoarding"
                                    hrefLang={locale}
                                    href="/onboarding"
                                >
                                    On boarding
                                </DropdownItem>
                                <DropdownItem
                                    key="settings"
                                    hrefLang={locale}
                                    href="/settings"
                                >
                                    Settings
                                </DropdownItem>
                            </DropdownSection>

                            <DropdownSection aria-label="Help & Settings">
                                <DropdownItem
                                    key="helpCenter"
                                    startContent={<UserCircle size={16} />}
                                    href="/help-center"
                                    hrefLang={locale}
                                >
                                    Help Center
                                </DropdownItem>
                                <DropdownItem
                                    key="logout"
                                    startContent={<LogOut size={16} />}
                                    color="danger"
                                    onPress={handleLogout}
                                >
                                    Logout
                                </DropdownItem>
                            </DropdownSection>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </div>
        </AntHeader>
    )
}

export default Header
