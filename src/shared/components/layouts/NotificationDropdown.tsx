import React from 'react'

import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownSection,
    DropdownTrigger,
} from '@heroui/react'
import { Bell } from 'lucide-react'

import { BellIcon } from '../icons/animate/BellIcon'

export default function NotificationDropdown() {
    return (
        <Dropdown placement="bottom-end">
            <DropdownTrigger>
                <Button
                    variant="light"
                    startContent={
                        <BellIcon
                            style={{
                                color: 'white',
                            }}
                            size={22}
                        />
                    }
                    isIconOnly
                />
            </DropdownTrigger>
            <DropdownMenu
                aria-label="User notification"
                disabledKeys={['title']}
                classNames={{
                    base: 'w-94 left-0',
                }}
            >
                <DropdownSection showDivider aria-label="Title">
                    <DropdownItem
                        key="title"
                        isReadOnly
                        className=" gap-2 opacity-100"
                        startContent={<Bell size={18} />}
                    >
                        <p className="font-semibold">Notifications (0)</p>
                    </DropdownItem>
                </DropdownSection>
                <DropdownSection aria-label="Notifications">
                    <DropdownItem key="title"></DropdownItem>
                </DropdownSection>
            </DropdownMenu>
        </Dropdown>
    )
}
