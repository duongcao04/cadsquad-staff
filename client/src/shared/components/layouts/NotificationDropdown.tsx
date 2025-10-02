'use client'

import React from 'react'

import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownSection,
    DropdownTrigger,
    Spinner,
    useDisclosure,
} from '@heroui/react'
import { Badge, Image } from 'antd'
import { Bell } from 'lucide-react'

import CadsquadLogo from '../CadsquadLogo'
import { BellIcon } from '../icons/animate/BellIcon'
import {
    useNotifications,
    useUpdateNotification,
} from '@/shared/queries/useNotification'
import { Notification } from '@/shared/interfaces/notification.interface'
import { NotificationStatus } from '@/shared/enums/notificationStatus.enum'

function NotificationCard({ data }: { data: Notification }) {
    const { mutateAsync: updateNotificationMutate } = useUpdateNotification()
    return (
        <div
            className="grid grid-cols-[50px_1fr_7px] gap-3 items-center"
            onClick={async () => {
                await updateNotificationMutate({
                    id: data.id,
                    data: {
                        status: NotificationStatus.SEEN,
                    },
                })
            }}
        >
            <div className="w-full aspect-square">
                {data?.imageUrl ? (
                    <div className="size-full aspect-square rounded-full">
                        <Image
                            src={data?.imageUrl}
                            alt="Notification image"
                            className="size-full aspect-square rounded-full object-fit"
                            preview={false}
                        />
                    </div>
                ) : (
                    <div className="size-full aspect-square rounded-full grid place-items-center bg-secondary">
                        <CadsquadLogo
                            classNames={{
                                logo: 'p-1.5',
                            }}
                            logoTheme="white"
                        />
                    </div>
                )}
            </div>
            <div className="space-y-1">
                <p className="text-sm font-semibold line-clamp-1">
                    {data?.title}
                </p>
                <p className="text-sm line-clamp-2">{data?.content}</p>
            </div>
            {data.status === NotificationStatus.UNSEEN && (
                <div className="w-full aspect-square rounded-full bg-gray-500"></div>
            )}
        </div>
    )
}

export default function NotificationDropdown() {
    const { isOpen, onClose, onOpen } = useDisclosure()
    const { data: notifications, isLoading, isFetching } = useNotifications()

    const countUnseen = notifications?.filter(
        (item) => item.status === NotificationStatus.UNSEEN
    ).length

    return (
        <Dropdown placement="bottom-end" isOpen={isOpen} onClose={onClose}>
            <DropdownTrigger>
                <Badge count={countUnseen ?? 0} color="danger" showZero={false}>
                    <Button
                        variant="light"
                        startContent={<BellIcon size={18} />}
                        size="sm"
                        isIconOnly
                        onPress={() => {
                            if (isOpen) {
                                onClose()
                            } else {
                                onOpen()
                            }
                        }}
                    />
                </Badge>
            </DropdownTrigger>
            <DropdownMenu
                aria-label="User notification"
                disabledKeys={['title']}
                classNames={{
                    base: 'w-96 left-0',
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
                            <span className="pl-0.5 tracking-wider text-text2">
                                ({countUnseen ?? 0})
                            </span>
                        </p>
                    </DropdownItem>
                </DropdownSection>
                {isLoading && isFetching ? (
                    <DropdownSection aria-label="Loading Notifications">
                        <DropdownItem key="Loading">
                            <div className="w-full h-full grid place-items-center">
                                <Spinner />
                            </div>
                        </DropdownItem>
                    </DropdownSection>
                ) : (
                    <DropdownSection aria-label="Notifications">
                        {notifications && notifications.length > 0 ? (
                            notifications.map((data, index) => {
                                const isUnseen =
                                    data.status === NotificationStatus.UNSEEN
                                return (
                                    <DropdownItem
                                        key={data.id ?? index}
                                        classNames={{
                                            base: `${
                                                isUnseen
                                                    ? 'bg-gray-200'
                                                    : 'transparent'
                                            } py-2`,
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
