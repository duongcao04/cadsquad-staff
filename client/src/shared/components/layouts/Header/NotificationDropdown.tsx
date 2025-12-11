'use client'

import { useRouter } from '@/i18n/navigation'
import { cookie } from '@/lib/cookie'
import { useNotifications } from '@/lib/queries/useNotification'
import { authSocket } from '@/lib/socket'
import { NotificationStatusEnum } from '@/shared/enums'
import {
    addToast,
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownSection,
    DropdownTrigger,
    Spinner,
} from '@heroui/react'
import { Bell } from 'lucide-react'
import { useEffect, useState } from 'react'
import { TUserNotification } from '../../../types'
import { BellIcon } from '../../icons/animate/BellIcon'
import { NotificationCard } from './NotificationCard'
import { COOKIES } from '../../../../lib/utils'

export function NotificationDropdown() {
    const router = useRouter()
    const token = cookie.get(COOKIES.authentication)
    const { data: notifications, isLoading, refetch } = useNotifications()
    const [newNotification, setNewNotification] =
        useState<TUserNotification | null>(null)

    const countUnseen =
        notifications?.filter(
            (item) => item.status === NotificationStatusEnum.UNSEEN
        ).length ?? 0

    const socket = authSocket()
    socket.auth = { token }
    socket.connect()
    socket.once('received_message', (data: Notification) => {
        setNewNotification(data)
    })

    useEffect(() => {
        if (newNotification) {
            refetch()
            addToast({
                title: newNotification.title ?? 'You have notification!',
                description: newNotification.content,
                color: 'success',
                shouldShowTimeoutProgress: true,
            })
        }
    }, [newNotification, refetch])

    return (
        <Dropdown placement="bottom-end">
            <DropdownTrigger>
                <Button
                    variant="light"
                    startContent={
                        <div className="relative">
                            <div className="absolute -top-1 right-0">
                                <span
                                    className="relative flex size-2"
                                    style={{
                                        display: countUnseen > 0 ? '' : 'none',
                                    }}
                                >
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-danger-300 opacity-75"></span>
                                    <span className="relative inline-flex size-2 rounded-full bg-danger"></span>
                                </span>
                            </div>
                            <BellIcon size={18} />
                        </div>
                    }
                    size="sm"
                    isIconOnly
                />
            </DropdownTrigger>
            <DropdownMenu
                aria-label="User notification"
                disabledKeys={['title']}
                classNames={{
                    base: 'w-[470px] left-0',
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
                            Notifications
                            <span className="pl-0.5 tracking-wider text-text-muted">
                                ({countUnseen ?? 0})
                            </span>
                        </p>
                    </DropdownItem>
                </DropdownSection>
                {isLoading ? (
                    <DropdownSection aria-label="Loading Notifications">
                        <DropdownItem key="Loading">
                            <div className="w-full h-full grid place-items-center">
                                <Spinner />
                            </div>
                        </DropdownItem>
                    </DropdownSection>
                ) : (
                    <DropdownSection
                        aria-label="Notifications"
                        classNames={{
                            base: 'max-h-[700px] overflow-y-auto',
                        }}
                    >
                        {notifications && notifications.length > 0 ? (
                            notifications.map((data, index) => {
                                const isUnseen =
                                    data.status ===
                                    NotificationStatusEnum.UNSEEN
                                return (
                                    <DropdownItem
                                        key={data.id ?? index}
                                        classNames={{
                                            base: `${
                                                isUnseen
                                                    ? 'bg-gray-200'
                                                    : 'transparent'
                                            } py-2 my-2`,
                                        }}
                                        onPress={() => {
                                            router.push(
                                                data.redirectUrl ??
                                                    'notifications'
                                            )
                                        }}
                                    >
                                        <NotificationCard data={data} />
                                    </DropdownItem>
                                )
                            })
                        ) : (
                            <DropdownItem key="title">
                                <p className="text-center">
                                    No have notification.
                                </p>
                            </DropdownItem>
                        )}
                    </DropdownSection>
                )}
            </DropdownMenu>
        </Dropdown>
    )
}
