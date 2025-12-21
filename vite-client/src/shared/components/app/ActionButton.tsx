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
} from '@/shared/components'
import { appStore, ESidebarStatus } from '@/shared/stores'
import { FluentColorBriefcase20 } from '../icons/FluentColorBriefcase20'
import { FluentColorApprovalsApp20 } from '../icons/FluentColorApprovalsApp20'
import { DeliverJobModal } from '../modals/DeliverJobModal'
import { IssueReportModal } from '../modals/IssueReportModal'
import { FluentColorErrorCircle20 } from '../icons/FluentColorErrorCircle20'

export function ActionButton({
    forceStatus,
}: {
    forceStatus?: 'collapse' | 'expand'
}) {
    const { isAdmin } = useProfile()
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
    const {
        isOpen: isOpenDeliverJobModal,
        onOpen: onOpenDeliverJobModal,
        onClose: onCloseDeliverJobModal,
    } = useDisclosure({ id: 'DeliverJobModal' })
    const {
        isOpen: isOpenIssueReportModal,
        onOpen: onOpenIssueReportModal,
        onClose: onCloseIssueReportModal,
    } = useDisclosure({ id: 'IssueReportModal' })

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
            {isAdmin && isOpenJM && (
                <CreateJobModal isOpen={isOpenJM} onClose={onCloseJM} />
            )}
            {isAdmin && isOpenUM && (
                <CreateUserModal isOpen={isOpenUM} onClose={onCloseUm} />
            )}
            {isAdmin && isOpenNM && (
                <CreateNotificationModal
                    isOpen={isOpenNM}
                    onClose={onCloseNM}
                />
            )}
            {isOpenDeliverJobModal && (
                <DeliverJobModal
                    isOpen={isOpenDeliverJobModal}
                    onClose={onCloseDeliverJobModal}
                />
            )}
            {isOpenIssueReportModal && (
                <IssueReportModal
                    isOpen={isOpenIssueReportModal}
                    onClose={onCloseIssueReportModal}
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
                            Actions
                        </p>
                    </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Admin actions" variant="flat">
                    <DropdownSection showDivider title="Job Operations">
                        {isAdmin ? (
                            <DropdownItem
                                key="createJob"
                                shortcut="Alt + N"
                                startContent={<FluentColorBriefcase20 />}
                                onPress={() => onOpenJM()}
                            >
                                Create
                            </DropdownItem>
                        ) : null}
                        <DropdownItem
                            key="deliverJob"
                            shortcut="Alt + D"
                            startContent={<FluentColorApprovalsApp20 />}
                            onPress={() => onOpenDeliverJobModal()}
                        >
                            Deliver
                        </DropdownItem>
                    </DropdownSection>
                    <DropdownSection showDivider={isAdmin} title="Support">
                        <DropdownItem
                            key="issueReport"
                            shortcut="Alt + I"
                            startContent={<FluentColorErrorCircle20 />}
                            onPress={() => onOpenIssueReportModal()}
                        >
                            Issue Report
                        </DropdownItem>
                    </DropdownSection>
                    {isAdmin ? (
                        <DropdownSection title="Team">
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
                    ) : null}
                </DropdownMenu>
            </Dropdown>
        </MotionDiv>
    )
}
