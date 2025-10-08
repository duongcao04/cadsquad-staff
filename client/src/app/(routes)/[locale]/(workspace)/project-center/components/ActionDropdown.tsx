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

import { Job } from '@/shared/interfaces/job.interface'
import { useAddMemberModal } from '@/shared/actions/useAddMemberModal'
import { EllipsisVerticalIcon } from 'lucide-react'
import { adminActions } from '../dropdowns/adminActions'
import { userActions } from '../dropdowns/userActions'
import { accountingActions } from '../dropdowns/accountingActions'
import useAuth from '@/shared/queries/useAuth'
import { RoleEnum } from '@/shared/enums/role.enum'
import { useDeleteJobMutation } from '../../../../../../shared/queries/useJob'
import { ApiError } from '../../../../../../lib/axios'

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
    onDeleteJob: (jobNo: string) => void
    data: Job
}
export default function ActionDropdown({ data }: Props) {
    const { openModal } = useAddMemberModal()
    const { userRole } = useAuth()
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
