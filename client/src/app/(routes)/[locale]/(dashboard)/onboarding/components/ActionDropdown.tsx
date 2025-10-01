'use client'

import React from 'react'

import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownItemProps,
    DropdownMenu,
    DropdownSection,
    DropdownSectionProps,
    DropdownTrigger,
} from '@heroui/react'
import {
    CircleCheck,
    CircleDollarSign,
    CopyIcon,
    Edit,
    EllipsisVerticalIcon,
    PinIcon,
    Trash,
    UserPlus,
} from 'lucide-react'

import { Job } from '@/shared/interfaces/job.interface'
import { useAddMemberModal } from '@/shared/actions/useAddMemberModal'

type ActionGroup = {
    key: React.Key | null | undefined
    groupTitle: string
    groupProps?: DropdownSectionProps
    children: {
        key: string | number
        title: string
        childProps?: Omit<DropdownItemProps, 'key'>
        icon: React.ReactNode
    }[]
}

type Props = {
    onDeleteJob: (jobNo: string) => void
    data: Job
}
export default function ActionDropdown({ data, onDeleteJob }: Props) {
    const { openModal } = useAddMemberModal()
    const adminActions: ActionGroup[] = [
        {
            key: 'Assignee menu',
            groupTitle: 'Assignee',
            children: [
                {
                    key: 'assignReassign',
                    title: 'Assign / Reassign',
                    icon: <UserPlus size={14} />,
                    childProps: {
                        onPress: () => {
                            openModal(data.no)
                        },
                    },
                },
            ],
        },
        {
            key: 'Job menu',
            groupTitle: 'Job',
            children: [
                {
                    key: 'pin',
                    title: 'Pin Job',
                    icon: <PinIcon size={14} className="rotate-45" />,
                    childProps: {
                        onPress: () => {},
                    },
                },
                {
                    key: 'assignReassign',
                    title: 'Assign / Reassign',
                    icon: <UserPlus size={14} />,
                    childProps: {
                        onPress: () => {
                            openModal(data.no as string)
                        },
                    },
                },
                {
                    key: 'editJob',
                    title: 'Edit Job',
                    icon: <Edit size={14} />,
                    childProps: {
                        onPress: () => {},
                    },
                },
                {
                    key: 'duplicateJob',
                    title: 'Duplicate Job',
                    icon: <CopyIcon size={14} />,
                    childProps: {
                        onPress: () => {},
                    },
                },
                {
                    key: 'deleteJob',
                    title: 'Delete',
                    icon: <Trash size={14} />,
                    childProps: {
                        color: 'danger',
                        onPress: () => {},
                    },
                },
            ],
        },
        {
            key: 'Payment menu',
            groupTitle: 'Payment',
            children: [
                {
                    key: 'updateCost',
                    title: 'Update Cost',
                    icon: <CircleDollarSign size={14} />,
                    childProps: {
                        onPress: () => {},
                    },
                },
                {
                    key: 'markAsPaid',
                    title: 'Mark as Paid',
                    icon: <CircleCheck size={14} />,
                    childProps: {
                        onPress: () => {},
                    },
                },
            ],
        },
    ]
    return (
        <Dropdown>
            <DropdownTrigger>
                <Button isIconOnly variant="light" size="sm">
                    <EllipsisVerticalIcon size={16} />
                </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Job menu actions">
                {adminActions.map((group) => {
                    return (
                        <DropdownSection
                            key={group.key}
                            title={group.groupTitle}
                            {...group.groupProps}
                        >
                            {group.children.map((item) => {
                                return (
                                    <DropdownItem
                                        key={item.key}
                                        startContent={
                                            <div className="text-text-fore2">
                                                {item.icon}
                                            </div>
                                        }
                                        {...item.childProps}
                                    >
                                        {item.title}
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
