'use client'

import React from 'react'

import {
    Avatar,
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
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

import CadsquadLogo from '../CadsquadLogo'

const { Header: AntHeader } = Layout

const Header = () => {
    const handleSearch = (value) => {
        console.log('Search value:', value)
    }

    const handleMenuClick = ({ key }) => {
        console.log('Menu clicked:', key)
    }

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
                        onPressEnter={(e) => handleSearch(e.target.value)}
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
                    <Dropdown>
                        <DropdownTrigger>
                            <Avatar
                                className="bg-[#87d068] cursor-pointer"
                                icon={<User size={18} />}
                            />
                        </DropdownTrigger>
                        <DropdownMenu
                            aria-label="User menu"
                            onAction={(key) => handleMenuClick({ key })}
                        >
                            <DropdownItem
                                key="profile"
                                startContent={<UserCircle size={16} />}
                            >
                                Profile
                            </DropdownItem>
                            <DropdownItem
                                key="settings"
                                startContent={<Settings size={16} />}
                            >
                                Settings
                            </DropdownItem>
                            <DropdownItem key="divider" />
                            <DropdownItem
                                key="logout"
                                startContent={<LogOut size={16} />}
                            >
                                Logout
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </div>
        </AntHeader>
    )
}

export default Header
