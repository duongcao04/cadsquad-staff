import { Drawer } from 'antd'
import React from 'react'

import {
    CalendarClock,
    AtSign,
    DollarSign,
    GalleryThumbnails,
    Hand,
    Handshake,
    Landmark,
    Loader,
    UsersRound,
    ArrowLeft,
    Text,
    Layers2,
    Paperclip,
    BanknoteArrowUp,
    Calendar,
} from 'lucide-react'
import { Switch } from '@heroui/react'
import { useJobColumns } from '@/shared/queries/useJob'
import { useUpdateConfigByCodeMutation } from '@/shared/queries/useConfig'
import { JobColumn } from '@/shared/types/job.type'
import { CONFIG_CONSTANTS } from '@/shared/constants/config.constant'
import useAuth from '@/shared/queries/useAuth'
import { RoleEnum } from '@/shared/enums/role.enum'

export type THeaderColumns = {
    title: string
    key: JobColumn
    icon?: React.ReactNode
}[]
type Props = { isOpen: boolean; onClose: () => void }

export default function ViewColumnsDrawer({ isOpen, onClose }: Props) {
    const { jobColumns: showColumns } = useJobColumns()
    const { userRole } = useAuth()
    const { mutateAsync: updateConfigMutate } = useUpdateConfigByCodeMutation()

    const columnMeta: Record<JobColumn, { title: string; icon?: React.ReactNode }> = {
        no: { title: "Job No.", icon: <p className="font-bold text-lg text-text1p5">#</p> },
        type: { title: "Job type", icon: <Layers2 size={20} className="text-text1p5" /> },
        thumbnail: { title: "Thumbnail", icon: <GalleryThumbnails size={20} className="text-text1p5" /> },
        displayName: { title: "Job name", icon: <AtSign size={20} className="text-text1p5" /> },
        description: { title: "Description", icon: <Text size={20} className="text-text1p5" /> },
        attachmentUrls: { title: "Attachments", icon: <Paperclip size={20} className="text-text1p5" /> },
        clientName: { title: "Client", icon: <Handshake size={20} className="text-text1p5" /> },
        incomeCost: { title: "Income", icon: <DollarSign size={20} className="text-text1p5" /> },
        staffCost: { title: "Staff cost", icon: <p className="font-semibold text-lg text-text1p5">đ</p> },
        assignee: { title: "Assignee", icon: <UsersRound size={20} className="text-text1p5" /> },
        paymentChannel: { title: "Payment channel", icon: <Landmark size={20} className="text-text1p5" /> },
        status: { title: "Status", icon: <Loader size={20} className="text-text1p5" /> },
        isPaid: { title: "Paid", icon: <BanknoteArrowUp size={20} className="text-text1p5" /> },
        dueAt: { title: "Due to", icon: <CalendarClock size={20} className="text-text1p5" /> },
        completedAt: { title: "Completed at", icon: <Calendar size={20} className="text-text1p5" /> },
        createdAt: { title: "Created at", icon: <Calendar size={20} className="text-text1p5" /> },
        updatedAt: { title: "Updated at", icon: <Calendar size={20} className="text-text1p5" /> },
        action: { title: "Action", icon: <Hand size={20} className="text-text1p5" /> },
    }

    // Auto-generate headerColumns from JobCols
    const headerColumns: THeaderColumns = (Object.keys(columnMeta) as JobColumn[]).map((key) => ({
        key,
        ...columnMeta[key],
    }))
    const canShowCols = userRole === RoleEnum.ADMIN ? CONFIG_CONSTANTS.values.allJobColumns.admin : CONFIG_CONSTANTS.values.allJobColumns.user
    const finalColumns = headerColumns.filter(col => {
        return canShowCols.includes(col.key)
    })

    return (
        <Drawer
            open={isOpen}
            title={<p>View columns</p>}
            width={450}
            maskClosable
            closeIcon={<ArrowLeft size={16} />}
            mask={true}
            onClose={onClose}
            classNames={{
                body: '!py-3 !px-5',
            }}
        >
            <div>
                <div className="flex items-center justify-between">
                    <p className="font-medium text-text1p5">Shown</p>
                    <button className="cursor-pointer hover:underline underline-offset-2 transition duration-150" onClick={() => {
                        const canShowAll = showColumns && showColumns.length === 0
                        if (canShowAll) {
                            const data = userRole === RoleEnum.ADMIN ? CONFIG_CONSTANTS.values.allJobColumns.admin : CONFIG_CONSTANTS.values.allJobColumns.user
                            updateConfigMutate({
                                code: CONFIG_CONSTANTS.keys.jobShowColumns,
                                data: {
                                    value: JSON.stringify(data)
                                }
                            })
                        } else {
                            updateConfigMutate({
                                code: CONFIG_CONSTANTS.keys.jobShowColumns,
                                data: {
                                    value: JSON.stringify([])
                                }
                            })
                        }
                    }}>
                        <p className="font-medium text-text1p5">{showColumns?.length === 0 ? "Show all" : "Hide all"}</p>
                    </button>
                </div>
                <div className="mt-2">
                    {finalColumns.map((col, idx) => {
                        const isSelected = showColumns?.includes(col.key)

                        return (
                            <div
                                key={idx}
                                className="flex items-center justify-between"
                            >
                                <div className="py-2.5 flex items-center justify-start gap-3">
                                    <div className="size-6 flex items-center justify-center">
                                        {col.icon}
                                    </div>
                                    <p className="text-base">{col.title}</p>
                                </div>
                                <Switch
                                    size="sm"
                                    isSelected={isSelected}
                                    classNames={{
                                        base: 'bg-white',
                                    }}
                                    onValueChange={(isSelected) => {
                                        if (showColumns) {
                                            if (!isSelected) {
                                                const newCols =
                                                    showColumns?.filter(
                                                        (item) => item !== col.key
                                                    )
                                                updateConfigMutate({
                                                    code: CONFIG_CONSTANTS.keys.jobShowColumns,
                                                    data: {
                                                        value: JSON.stringify(newCols)
                                                    }
                                                })
                                            } else {
                                                const newCols = [
                                                    ...showColumns,
                                                    col.key,
                                                ]
                                                updateConfigMutate({
                                                    code: CONFIG_CONSTANTS.keys.jobShowColumns,
                                                    data: {
                                                        value: JSON.stringify(newCols)
                                                    }
                                                })
                                            }
                                        }
                                    }}
                                />
                            </div>
                        )
                    })}
                </div>
            </div>
        </Drawer>
    )
}
