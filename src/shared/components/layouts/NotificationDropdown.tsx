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
} from '@heroui/react'
import { Image } from 'antd'
import { Bell } from 'lucide-react'
import useSWR from 'swr'

import { supabase } from '@/lib/supabase/client'
import { getNotifications } from '@/lib/swr/actions/notification'
import { NOTIFICATION_API } from '@/lib/swr/api'
import { Notification } from '@/validationSchemas/notification.schema'

import CadsquadLogo from '../CadsquadLogo'
import { BellIcon } from '../icons/animate/BellIcon'

function NotificationCard({ data }: { data: Notification }) {
    return (
        <div className="grid grid-cols-[50px_1fr_7px] gap-3 items-center">
            <div className="w-full aspect-square">
                {data?.image ? (
                    <div className="size-full aspect-square rounded-full">
                        <Image
                            src={data?.image}
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
    const {
        data: notifications,
        mutate,
        isLoading,
        isValidating,
    } = useSWR(NOTIFICATION_API, getNotifications)

    supabase
        .channel('userNotifications')
        .on(
            'postgres_changes',
            {
                event: '*', // hoặc 'INSERT', 'UPDATE', 'DELETE'
                schema: 'public',
                table: 'UserNotification',
            },
            (payload) => {
                console.log('Realtime change received!', payload)
                mutate()
            }
        )
        .subscribe()

    // Can use it avoid revalidate -> loose time
    //         const { data, mutate } = useSWR('/api/users', fetcher)
    // Then you POST a new user:
    // ts
    // Copy
    // Edit
    // const newUser = { id: 4, name: 'Duong' }

    // await mutate(async (currentUsers) => {
    //   const response = await fetch('/api/users', {
    //     method: 'POST',
    //     body: JSON.stringify(newUser),
    //     headers: { 'Content-Type': 'application/json' },
    //   })
    //   const createdUser = await response.json()

    //   return [...(currentUsers || []), createdUser]
    // }, {
    //   populateCache: true, // update local cache immediately
    //   revalidate: false,   // don't refetch from server
    // })

    return (
        <Dropdown placement="bottom-end">
            <DropdownTrigger>
                <Button
                    variant="light"
                    startContent={
                        <BellIcon
                            size={18}
                        />
                    }
                    size='sm'
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
                {isLoading && isValidating ? (
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
