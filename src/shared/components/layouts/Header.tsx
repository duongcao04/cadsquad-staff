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
    User as UserComp,
    addToast,
} from '@heroui/react'
import { Input, Layout } from 'antd'
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

import { usePathname, useRouter } from '@/i18n/navigation'
import { logoutSession } from '@/lib/auth/session'
import { supabase } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/zustand/useAuthStore'

import AppLoader from '../../../app/[locale]/loading'
import CadsquadLogo from '../CadsquadLogo'

const { Header: AntHeader } = Layout

const Header = () => {
    const locale = useLocale()
    const router = useRouter()
    const pathname = usePathname()

    const [isLoading, setLoading] = useState(false)

    const authUser = useAuthStore((state) => state.authUser)
    const { removeAuthUser } = useAuthStore()

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
                pathname: 'auth',
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
            }}
        >
            {/* Logo */}
            <div className="container grid grid-cols-[130px_1fr_200px] gap-5 items-center">
                <CadsquadLogo
                    classNames={{
                        logo: 'h-14',
                    }}
                    logoTheme="white"
                />

                {/* Search bar */}
                <div style={{ flex: 1 }}>
                    <Input
                        placeholder="Search"
                        prefix={<Search size={16} color="#999" />}
                        size="large"
                        style={{
                            borderRadius: '8px',
                            background: 'white',
                        }}
                    />
                </div>

                {/* Right actions */}
                <div className="flex justify-end items-center gap-3">
                    {/* Notification Bell */}
                    <Button
                        variant="light"
                        startContent={<Bell size={25} color="white" />}
                        isIconOnly
                        onPress={() => console.log('Notifications clicked')}
                    />

                    {/* Settings */}
                    <Button
                        variant="light"
                        startContent={<Settings size={25} color="white" />}
                        isIconOnly
                        onPress={() => console.log('Settings clicked')}
                    />

                    {/* Help */}
                    <Button
                        variant="light"
                        startContent={<HelpCircle size={25} color="white" />}
                        isIconOnly
                        onPress={() => console.log('Help clicked')}
                    />

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
