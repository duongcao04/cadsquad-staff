import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownSection,
    DropdownTrigger,
    useDisclosure,
} from '@heroui/react'
import { useStore } from '@tanstack/react-store'
import hotkeys from 'hotkeys-js'
import { PlusIcon } from 'lucide-react'
import { type Variants } from 'motion/react'
import { useEffect } from 'react'

import { MotionDiv } from '@/lib/motion'
import { useProfile } from '@/lib/queries'
import {
    CreateJobModal,
    CreateNotificationModal,
    CreateUserModal,
    IconAlertColorful,
    IconPeopleColorful,
    IconWorkColorful,
} from '@/shared/components'
import { appStore, ESidebarStatus } from '@/shared/stores'

export function ActionButton({
    forceStatus,
}: {
    forceStatus?: 'collapse' | 'expand'
}) {
    const { isAdmin, isAccounting, isStaff } = useProfile()

    if (isAdmin) {
        return <AdminCreateButton forceStatus={forceStatus} />
    }
    if (isAccounting) {
        return <AccountingButton />
    }
    if (isStaff) {
        return <StaffButton />
    }
}

export function StaffButton() {
    return <div></div>
}

export function AccountingButton() {
    return <div></div>
}

export function AdminCreateButton({
    forceStatus,
}: {
    forceStatus?: 'collapse' | 'expand'
}) {
    const sidebarStatus = forceStatus
        ? forceStatus
        : useStore(appStore, (state) => state.sidebarStatus)

    const {
        isOpen: isOpenJM,
        onOpen: onOpenJM,
        onClose: onCloseJM,
    } = useDisclosure({
        id: 'JobModal',
    })
    const {
        isOpen: isOpenUM,
        onOpen: onOpenUM,
        onClose: onCloseUm,
    } = useDisclosure({
        id: 'UserModal',
    })
    const {
        isOpen: isOpenNM,
        onOpen: onOpenNM,
        onClose: onCloseNM,
    } = useDisclosure({
        id: 'NotificationModal',
    })

    useEffect(() => {
        hotkeys('alt+n,alt+u,alt+m', function (event, handler) {
            switch (handler.key) {
                case 'alt+n':
                    onOpenJM()
                    break
                case 'alt+u':
                    onOpenUM()
                    break
                case 'alt+m':
                    onOpenNM()
                    break
                default:
                    alert(event)
            }
        })
    }, [])

    const iconVariants: Variants = {
        init: { opacity: 0, rotate: 0 },
        animate: {
            opacity: 1,
            rotate: 0,
            transition: { damping: 20, type: 'spring' },
        },
        hover: {
            opacity: 1,
            rotate: '180deg',
            transition: { damping: 20, type: 'spring' },
        },
    }

    return (
        <MotionDiv
            initial="init"
            animate="animate"
            whileHover="hover"
            className="w-fit"
        >
            {isOpenJM && (
                <CreateJobModal isOpen={isOpenJM} onClose={onCloseJM} />
            )}
            {isOpenUM && (
                <CreateUserModal isOpen={isOpenUM} onClose={onCloseUm} />
            )}
            {isOpenNM && (
                <CreateNotificationModal
                    isOpen={isOpenNM}
                    onClose={onCloseNM}
                />
            )}
            <Dropdown>
                <DropdownTrigger className="w-fit">
                    <Button
                        startContent={
                            <MotionDiv variants={iconVariants}>
                                <PlusIcon size={20} />
                            </MotionDiv>
                        }
                        size="sm"
                        isIconOnly={sidebarStatus === ESidebarStatus.COLLAPSE}
                        className="text-sm text-white rounded-full bg-linear-to-br from-primary-500 via-primary-700 to-primary-800 font-semibold"
                        style={{
                            paddingLeft:
                                sidebarStatus === ESidebarStatus.EXPAND
                                    ? '12px'
                                    : '0',
                            paddingRight:
                                sidebarStatus === ESidebarStatus.EXPAND
                                    ? '16px'
                                    : '0',
                        }}
                    >
                        <p
                            style={{
                                display:
                                    sidebarStatus === ESidebarStatus.EXPAND
                                        ? 'block'
                                        : 'none',
                            }}
                        >
                            Create
                        </p>
                    </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Admin actions" variant="flat">
                    <DropdownSection showDivider>
                        <DropdownItem
                            key="createJob"
                            shortcut="Alt + N"
                            startContent={<IconWorkColorful />}
                            onPress={() => onOpenJM()}
                        >
                            Job
                        </DropdownItem>
                    </DropdownSection>
                    {/* <DropdownSection showDivider>
                        <DropdownItem
                            key="createFolder"
                            shortcut="Ctrl + ⇧ + F"
                            startContent={<IconFolderColorful />}
                        >
                            {t('folder')}
                        </DropdownItem>
                        <DropdownItem
                            key="createFile"
                            shortcut="Ctrl + ⇧ + G"
                            startContent={<IconFileColorful />}
                        >
                            {t('file')}
                        </DropdownItem>
                    </DropdownSection> */}
                    <DropdownSection>
                        <DropdownItem
                            key="createUser"
                            shortcut="Alt + U"
                            startContent={<IconPeopleColorful />}
                            onPress={() => onOpenUM()}
                        >
                            User
                        </DropdownItem>
                        <DropdownItem
                            key="sendNotification"
                            shortcut="Alt + M"
                            startContent={<IconAlertColorful />}
                            onPress={() => onOpenNM()}
                        >
                            Notifications
                        </DropdownItem>
                    </DropdownSection>
                </DropdownMenu>
            </Dropdown>
        </MotionDiv>
    )
}
