import { useNotifications } from '@/lib/queries/useNotification'
import { NotificationStatusEnum } from '@/shared/enums'
import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownSection,
    DropdownTrigger,
    Spinner,
} from '@heroui/react'
import { Bell, RefreshCcw } from 'lucide-react'
import { BellIcon } from '../../icons/animate/BellIcon'
import { NotificationCard } from './NotificationCard'
import { HeroButton } from '../../ui/hero-button'

export function NotificationDropdown() {
    const { notifications, isLoading, unseenCount } = useNotifications()

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
                                        display: unseenCount > 0 ? '' : 'none',
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
                classNames={{
                    base: 'w-100 left-0',
                }}
            >
                <DropdownSection
                    showDivider
                    aria-label="Title"
                    className="hover:bg-none!"
                    classNames={{
                        group: 'hover:bg-transparent!',
                        heading: 'hover:bg-transparent!',
                        base: 'hover:bg-transparent! cursor-default py-0!',
                    }}
                >
                    <DropdownItem
                        key="title"
                        isReadOnly
                        className=" gap-2 opacity-100"
                        startContent={<Bell size={18} />}
                        endContent={
                            <HeroButton
                                variant="light"
                                color="default"
                                size="xs"
                                className="size-7! p-0 text-text-7"
                            >
                                <RefreshCcw size={14} />
                            </HeroButton>
                        }
                    >
                        <p className="font-semibold">
                            Notifications
                            <span className="pl-1 tracking-wider text-text-subdued">
                                ({unseenCount})
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
                                            // router.push(
                                            //     data.redirectUrl ??
                                            //         'notifications'
                                            // )
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
