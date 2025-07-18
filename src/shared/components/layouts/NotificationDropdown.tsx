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
import { Bell, Dot } from 'lucide-react'
import Image from 'next/image'
import useSWR from 'swr'

import { getNotifications } from '@/lib/swr/actions/notification'
import { NOTIFICATION_API } from '@/lib/swr/api'
import { UserNotification } from '@/validationSchemas/notification.schema'

import CadsquadLogo from '../CadsquadLogo'
import { BellIcon } from '../icons/animate/BellIcon'

function NotificationCard({ data }: { data: UserNotification }) {
    return (
        <div className="grid grid-cols-[50px_1fr_7px] gap-3 items-center">
            <div className="w-full aspect-square rounded-full bg-secondary grid place-items-center">
                {data?.image ? (
                    <Image src={data?.image} alt="Notification image" />
                ) : (
                    <CadsquadLogo
                        classNames={{
                            logo: 'p-1.5',
                        }}
                        logoTheme="white"
                    />
                )}
            </div>
            <div className="space-y-0.5">
                <p className="text-sm font-semibold line-clamp-1">
                    {data?.title}
                </p>
                <p className="text-sm line-clamp-2">{data?.content}</p>
            </div>
            <div className="w-full aspect-square rounded-full bg-secondary"></div>
        </div>
    )
}

export default function NotificationDropdown() {
    const { data: notifications } = useSWR(NOTIFICATION_API, getNotifications)

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
                        <p className="font-semibold">
                            Notifications ({notifications?.length ?? 0})
                        </p>
                    </DropdownItem>
                </DropdownSection>
                <DropdownSection aria-label="Notifications">
                    {notifications && notifications.length > 0 ? (
                        notifications.map((noti, index) => {
                            return (
                                <DropdownItem key={noti?.id ?? index}>
                                    <NotificationCard
                                        data={noti.notification}
                                    />
                                </DropdownItem>
                            )
                        })
                    ) : (
                        <DropdownItem key="title">
                            <p className="text-center">No have notification.</p>
                        </DropdownItem>
                    )}
                </DropdownSection>
            </DropdownMenu>
        </Dropdown>
    )
}
