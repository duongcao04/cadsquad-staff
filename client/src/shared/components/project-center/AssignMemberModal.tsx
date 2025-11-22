'use client'

import { envConfig } from '@/lib/config'
import { useProfile, useUsers } from '@/lib/queries'
import {
    useAssignMemberMutation,
    useJobByNo,
    useRemoveMemberMutation,
} from '@/lib/queries/useJob'
import { handleCopy } from '@/shared/components'
import { RoleEnum } from '@/shared/enums'
import { Button, Input } from '@heroui/react'
import { Image, Modal, Select } from 'antd'
import { X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

type AssignMemberModalProps = {
    jobNo: string
    isOpen: boolean
    onClose: () => void
}
export default function AssignMemberModal({
    jobNo,
    isOpen,
    onClose,
}: AssignMemberModalProps) {
    const t = useTranslations()

    const { job } = useJobByNo(jobNo)

    const { userRole, isAdmin } = useProfile()

    const JOB_DETAIL_URL =
        envConfig.NEXT_PUBLIC_URL + `/project-center?detail=${jobNo}`

    const [memberSelected, setMemberSelected] = useState<string[]>([])
    const { mutateAsync: assignMemberMutate } = useAssignMemberMutation()
    const { mutateAsync: removeMemberMutate } = useRemoveMemberMutation()

    const { users } = useUsers()

    const onAssignMember = async (updateMemberIds: string[]) => {
        await assignMemberMutate({
            jobId: String(job?.id),
            assignMemberInput: {
                prevMemberIds: JSON.stringify(
                    job?.assignee.map((mem) => mem.id)
                ),
                updateMemberIds: JSON.stringify(updateMemberIds),
            },
        })
    }

    const onRemoveMember = async (jobId: string, memberId: string) =>
        await removeMemberMutate({
            jobId,
            memberId,
        })

    const handleChange = (value: string[]) => {
        setMemberSelected(value)
    }

    return (
        <Modal
            open={isOpen}
            onCancel={() => {
                setMemberSelected([])
                onClose()
            }}
            title={
                <div className="p-2">
                    <p className="text-lg font-semibold">
                        {t('memberAssignedIn', { jobNo: job?.no ?? '' })}
                    </p>
                    <p className="text-sm font-normal text-text-muted">
                        {t('systemWillSendNotificationThemInstruction')}
                    </p>
                </div>
            }
            width={{
                xs: '90%',
                sm: '80%',
                md: '70%',
                lg: '60%',
                xl: '40%',
                xxl: '40%',
            }}
            footer={<></>}
        >
            <div className="px-2">
                {isAdmin && (
                    <div className="space-y-1.5 mb-6">
                        <p className="font-semibold text-text-muted">
                            {t('assignMembersNumber', {
                                number: memberSelected?.length,
                            })}
                        </p>
                        <div className="grid grid-cols-[1fr_100px] gap-4">
                            <Select
                                mode="multiple"
                                style={{ width: '100%' }}
                                placeholder={t('assignMemberHint')}
                                value={memberSelected}
                                onChange={handleChange}
                                options={users
                                    ?.filter(
                                        (user) =>
                                            !job?.assignee?.some(
                                                (selected) =>
                                                    selected.id === user.id
                                            )
                                    )
                                    ?.map((user) => {
                                        return {
                                            ...user,
                                            value: user.id,
                                            label: user.displayName,
                                        }
                                    })}
                                filterOption={(input, option) =>
                                    (option?.label ?? '')
                                        .toLowerCase()
                                        .includes(input.toLowerCase()) ||
                                    (option?.email ?? '')
                                        .toLowerCase()
                                        .includes(input.toLowerCase()) ||
                                    (option?.username ?? '')
                                        .toLowerCase()
                                        .includes(input.toLowerCase()) ||
                                    (option?.department?.displayName ?? '')
                                        .toLowerCase()
                                        .includes(input.toLowerCase())
                                }
                                optionRender={(option) => {
                                    const departmentColor = option.data
                                        .department
                                        ? option.data.department?.hexColor
                                        : 'transparent'
                                    return (
                                        <div className="flex items-center justify-start gap-4 !p-0">
                                            <Image
                                                src={
                                                    option.data.avatar as string
                                                }
                                                alt="user avatar"
                                                rootClassName="!size-10 rounded-full"
                                                className="!size-full rounded-full p-[1px] border-2"
                                                preview={false}
                                                style={{
                                                    borderColor:
                                                        departmentColor,
                                                }}
                                            />
                                            <div>
                                                <p className="font-semibold">
                                                    {option.label}
                                                </p>
                                                <p className="text-text-muted !font-normal">
                                                    {option.data.email}
                                                </p>
                                            </div>
                                        </div>
                                    )
                                }}
                            />
                            <Button
                                onPress={async () => {
                                    onAssignMember(memberSelected)
                                }}
                                color="primary"
                            >
                                {t('assign')}
                            </Button>
                        </div>
                    </div>
                )}
                <hr className="mb-4 text-text-muted" />
                <div className="space-y-2.5">
                    <p className="font-semibold text-text-muted">
                        {t('members')} ({job?.assignee?.length})
                    </p>
                    <div className="space-y-1.5 max-h-[430px] overflow-y-auto -mx-2">
                        {job?.assignee?.length === 0 && (
                            <p className="my-8 text-center text-text-muted">
                                No members have been assigned yet.
                            </p>
                        )}
                        {job?.assignee?.map((mem) => {
                            return (
                                <div
                                    key={mem.username}
                                    className="group flex items-center justify-between px-2 py-1.5 hover:bg-text-muted rounded-md"
                                >
                                    <div className="flex items-center justify-start gap-4">
                                        <Image
                                            src={mem?.avatar as string}
                                            alt="user avatar"
                                            rootClassName="!size-10 rounded-full"
                                            className="!size-full rounded-full"
                                            preview={false}
                                        />
                                        <div>
                                            <p className="font-semibold">
                                                {mem?.displayName}
                                            </p>
                                            <p className="text-text-muted !font-normal">
                                                {mem?.email}
                                            </p>
                                        </div>
                                    </div>
                                    {userRole === RoleEnum.ADMIN && (
                                        <Button
                                            isIconOnly
                                            size="sm"
                                            color="danger"
                                            className="hidden group-hover:flex"
                                            title="Remove"
                                            onPress={() =>
                                                onRemoveMember(job.id, mem.id)
                                            }
                                        >
                                            <X size={14} />
                                        </Button>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
                <hr className="mt-6 mb-4 text-text-muted" />
                <div className="space-y-2.5">
                    <p className="font-semibold text-text-muted">
                        {t('copyLink')}
                    </p>
                    <div className="grid grid-cols-[1fr_80px] gap-5">
                        <Input
                            value={JOB_DETAIL_URL}
                            isDisabled
                            className="!opacity-70"
                        />
                        <Button
                            color="primary"
                            className="text-white"
                            onPress={() => handleCopy(JOB_DETAIL_URL)}
                        >
                            {t('copy')}
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    )
}
