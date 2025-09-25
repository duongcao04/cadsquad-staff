'use client'

import React from 'react'

import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownSection,
    DropdownTrigger,
} from '@heroui/react'
import { SettingsGearIcon } from '../icons/animate/SettingsGearIcon'
import {
    ADMIN_SETTING_DROPDOWN,
    VI_ADMIN_SETTING_DROPDOWN,
} from '../../constants/adminSettingDropdown'
import { useLocale } from 'next-intl'
import { Link } from '../../../i18n/navigation'

export default function SettingsDropdown() {
    const locale = useLocale()
    const dropdownData =
        locale === 'vi' ? VI_ADMIN_SETTING_DROPDOWN : ADMIN_SETTING_DROPDOWN
    return (
        <Dropdown
            placement="bottom-end"
            showArrow
            classNames={{
                content: 'rounded-lg',
            }}
        >
            <DropdownTrigger>
                <Button
                    variant="light"
                    startContent={<SettingsGearIcon size={18} />}
                    size="sm"
                    isIconOnly
                />
            </DropdownTrigger>
            <DropdownMenu
                aria-label="User notification"
                disabledKeys={['title']}
                classNames={{
                    base: 'w-[520px] overflow-y-auto left-0',
                }}
            >
                {dropdownData.map((group) => {
                    return (
                        <DropdownSection
                            key={group.id}
                            title={group.groupTitle}
                        >
                            {group.children.map((item) => {
                                return (
                                    <DropdownItem
                                        key={item.id}
                                        startContent={
                                            <div className="size-[32px] grid place-items-center">
                                                <item.icon size={18} />
                                            </div>
                                        }
                                    >
                                        <Link
                                            href={item.href}
                                            className="block size-full"
                                            passHref
                                        >
                                            <p>{item.title}</p>
                                            <p className="text-xs text-text2">
                                                {item.description}
                                            </p>
                                        </Link>
                                    </DropdownItem>
                                )
                            })}
                        </DropdownSection>
                    )
                })}
            </DropdownMenu>
        </Dropdown>
    )
}
