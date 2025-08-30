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
} from 'lucide-react'
import { useJobStore } from '../store/useJobStore'
import { Switch } from '@heroui/react'
import { useJobs } from '@/queries/useJob'

export type THeaderColumns = {
    title: string
    key: string
    icon: React.ReactNode
}[]
type Props = { isOpen: boolean; onClose: () => void }

export default function ViewColumnsDrawer({ isOpen, onClose }: Props) {
    const { hideCols } = useJobs()
    const { jobVisibleColumns, setJobVisibleColumns } = useJobStore()

    const headerColumns: THeaderColumns = [
        {
            title: 'Thumbnail',
            key: 'thumbnail',
            icon: <GalleryThumbnails size={20} className="text-text1p5" />,
        },
        {
            title: 'Client',
            key: 'clientName',
            icon: <Handshake size={20} className="text-text1p5" />,
        },
        {
            title: 'Job No.',
            key: 'jobNo',
            icon: <p className="font-bold text-lg text-text1p5">#</p>,
        },
        {
            title: 'Job name',
            key: 'jobName',
            icon: <AtSign size={20} className="text-text1p5" />,
        },
        {
            title: 'Income',
            key: 'income',
            icon: <DollarSign size={20} className="text-text1p5" />,
        },
        {
            title: 'Staff cost',
            key: 'staffCost',
            icon: <p className="font-semibold text-lg text-text1p5">đ</p>,
        },
        {
            title: 'Payment channel',
            key: 'paymentChannel',
            icon: <Landmark size={20} className="text-text1p5" />,
        },
        {
            title: 'Due to',
            key: 'dueAt',
            icon: <CalendarClock size={20} className="text-text1p5" />,
        },
        {
            title: 'Assignee',
            key: 'memberAssign',
            icon: <UsersRound size={20} className="text-text1p5" />,
        },
        {
            title: 'Status',
            key: 'jobStatus',
            icon: <Loader size={20} className="text-text1p5" />,
        },
        {
            title: 'Action',
            key: 'action',
            icon: <Hand size={20} className="text-text1p5" />,
        },
    ]

    const newColumns = headerColumns.filter(
        (item) => !hideCols.includes(item.key)
    )

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
                    <button className="cursor-pointer hover:underline underline-offset-2 transition duration-150">
                        <p className="font-medium text-text1p5">Hide all</p>
                    </button>
                </div>
                <div className="mt-2">
                    {newColumns.map((col, idx) => {
                        const isSelected = jobVisibleColumns.includes(col.key)

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
                                        if (!isSelected) {
                                            const newVisibleCols =
                                                jobVisibleColumns.filter(
                                                    (item) => item !== col.key
                                                )
                                            setJobVisibleColumns(newVisibleCols)
                                        } else {
                                            const newVisibleCols = [
                                                ...jobVisibleColumns,
                                                col.key,
                                            ]
                                            setJobVisibleColumns(newVisibleCols)
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
