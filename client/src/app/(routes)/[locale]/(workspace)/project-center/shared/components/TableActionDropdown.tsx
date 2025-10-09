'use client'

import React from 'react'

import {
    addToast,
    Button,
    Dropdown,
    DropdownItem,
    DropdownItemProps,
    DropdownMenu,
    DropdownSection,
    DropdownSectionProps,
    DropdownTrigger,
} from '@heroui/react'

import { ApiError } from '@/lib/axios'
import { useAddMemberModal } from '@/shared/actions'
import { RoleEnum } from '@/shared/enums'
import { Job } from '@/shared/interfaces'
import { useDeleteJobMutation, useProfile } from '@/shared/queries'
import { EllipsisVerticalIcon } from 'lucide-react'
import { accountingActions, adminActions, userActions } from '../dropdowns'

export type ActionGroup = {
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
    data: Job
}
export function TableActionDropdown({ data }: Props) {
    const { openModal } = useAddMemberModal()
    const { userRole } = useProfile()
    const { mutateAsync: deleteJobMutation } = useDeleteJobMutation()

    const handleDelete = async () => {
        await deleteJobMutation(data.id, {
            onSuccess: (res) => {
                addToast({
                    title: res.data.message,
                    color: 'success',
                })
            },
            onError(error) {
                const err = error as unknown as ApiError
                addToast({
                    title: err.message,
                    color: 'danger',
                })
            },
        })
    }

    const getActions: () => ActionGroup[] = () => {
        if (userRole === RoleEnum.ADMIN) {
            return adminActions(
                data.no,
                () => {
                    openModal(data.no)
                },
                handleDelete
            )
        }
        if (userRole === RoleEnum.USER) {
            return userActions(data.no)
        }
        return accountingActions(data.no)
    }
    const actionsDropdown = getActions()

    return (
        <Dropdown>
            <DropdownTrigger>
                <Button isIconOnly variant="light" size="sm">
                    <EllipsisVerticalIcon size={16} />
                </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Job menu actions">
                {actionsDropdown.map((group) => {
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
