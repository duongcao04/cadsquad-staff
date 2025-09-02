'use client'

import { Image, Modal, Select } from 'antd'
import React, { useState } from 'react'
import { useAddMemberModal } from './actions'
import { useUsers } from '@/queries/useUser'
import { addToast, Button, Input } from '@heroui/react'
import { useAssignMemberMutation, useJobDetail } from '@/queries/useJob'
import envConfig from '@/config/envConfig'

export default function AddMemberModal() {
    const [memberSelected, setMemberSelected] = useState<string[]>([])
    const { isOpen, closeModal, jobNo } = useAddMemberModal()
    const { mutateAsync: assignMemberMutate } = useAssignMemberMutation()

    const { data: users } = useUsers()
    const { job } = useJobDetail(jobNo)

    const JOB_DETAIL_URL =
        envConfig.NEXT_PUBLIC_URL + `onboarding?detail=${jobNo}`

    const handleCopy = (text: string) => {
        navigator.clipboard
            .writeText(text)
            .then(() => {
                addToast({
                    title: 'Sao chép thành công',
                    color: 'success',
                })
            })
            .catch((err) => {
                console.log(err)
                addToast({
                    title: 'Sao chép thất bại',
                    color: 'danger',
                })
            })
    }

    const handleAssignMember = async (updateMemberIds: string[]) => {
        try {
            await assignMemberMutate(
                {
                    jobId: String(job?.id),
                    assignMemberInput: {
                        prevMemberIds: JSON.stringify(
                            job?.memberAssign.map((mem) => mem.id)
                        ),
                        updateMemberIds: JSON.stringify(updateMemberIds),
                    },
                },
                {
                    onSuccess: () => {
                        addToast({
                            title: 'Phân công thành viên thành công',
                            color: 'success',
                        })
                    },
                    onError: () => {
                        addToast({
                            title: 'Phân công thành viên thất bại',
                            color: 'danger',
                        })
                    },
                }
            )
        } catch (error) {
            console.log(error)
            addToast({
                title: 'Cập nhật trạng thái thất bại',
                color: 'danger',
            })
        }
    }

    const handleChange = (value: string[]) => {
        setMemberSelected(value)
    }

    return (
        <Modal
            open={isOpen}
            onCancel={() => {
                setMemberSelected([])
                closeModal()
            }}
            title={
                <div className="p-2">
                    <p className="text-lg font-semibold">
                        Invite member to job #{jobNo}
                    </p>
                    <p className="text-sm text-text2 font-normal">
                        System will send notification them instruction.
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
                <div className="space-y-1.5">
                    <p className="font-semibold text-text2">Invite users</p>
                    <div className="grid grid-cols-[1fr_100px] gap-5">
                        <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            placeholder="Search by name, email, username, department,..."
                            value={memberSelected}
                            onChange={handleChange}
                            options={users?.map((user) => {
                                return {
                                    ...user,
                                    value: user.id,
                                    label: user.name,
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
                                (option?.department ?? '')
                                    .toLowerCase()
                                    .includes(input.toLowerCase())
                            }
                            optionRender={(option) => {
                                return (
                                    <div className="flex items-center justify-start gap-4">
                                        <Image
                                            src={option.data.avatar as string}
                                            alt="user avatar"
                                            rootClassName="!size-10 rounded-full"
                                            className="!size-full rounded-full"
                                            preview={false}
                                        />
                                        <div>
                                            <p className="font-semibold">
                                                {option.label}
                                            </p>
                                            <p className="text-text2 !font-normal">
                                                {option.data.email}
                                            </p>
                                        </div>
                                    </div>
                                )
                            }}
                        />
                        <Button
                            onPress={async () => {
                                handleAssignMember(memberSelected)
                            }}
                        >
                            Send invites
                        </Button>
                    </div>
                </div>
                <hr className="mt-6 mb-4 text-text3" />
                <div className="space-y-2.5">
                    <p className="font-semibold text-text2">
                        Members ({job?.memberAssign?.length})
                    </p>
                    <div className="space-y-4">
                        {job?.memberAssign.length === 0 && (
                            <p className="text-text2 my-8 text-center">
                                No members have been assigned yet.
                            </p>
                        )}
                        {job?.memberAssign?.map((mem) => {
                            return (
                                <div key={mem.id}>
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
                                                {mem?.name}
                                            </p>
                                            <p className="text-text2 !font-normal">
                                                {mem?.email}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <hr className="mt-6 mb-4 text-text3" />
                <div className="space-y-2.5">
                    <p className="font-semibold text-text2">Copy link</p>
                    <div className="grid grid-cols-[1fr_80px] gap-5">
                        <Input
                            value={JOB_DETAIL_URL}
                            isDisabled
                            className="!opacity-70"
                        />
                        <Button onPress={() => handleCopy(JOB_DETAIL_URL)}>
                            Copy
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    )
}
