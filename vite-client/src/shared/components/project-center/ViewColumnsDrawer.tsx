import { Drawer } from 'antd'
import React from 'react'
import { RoleEnum } from '@/shared/enums'
import {
    useJobColumns,
    useProfile,
    useUpdateConfigByCodeMutation,
} from '@/lib/queries'
import { USER_CONFIG_KEYS, USER_CONFIG_VALUES } from '@/lib/utils'
import type { JobColumn, JobColumnKey } from '@/shared/types'
import { Spinner } from '@heroui/react'
import {
    ArrowLeft,
    AtSign,
    BanknoteArrowUp,
    Calendar,
    CalendarClock,
    DollarSign,
    GalleryThumbnails,
    Hand,
    Handshake,
    Landmark,
    Layers2,
    Loader,
    Paperclip,
    Text,
    UsersRound,
} from 'lucide-react'
import { ViewColumnSwitch } from './ViewColumnSwitch'

type THeaderColumns = {
    title: string
    key: JobColumn
    icon?: React.ReactNode
}[]
type Props = { isOpen: boolean; onClose: () => void }

export function ViewColumnsDrawer({ isOpen, onClose }: Props) {
    const { jobColumns: showColumns } = useJobColumns()
    const { userRole } = useProfile()
    const { mutateAsync: updateConfigMutate, isPending: isLoading } =
        useUpdateConfigByCodeMutation()

    const columnMeta: Record<
        JobColumn,
        { title: string; icon?: React.ReactNode }
    > = {
        no: {
            title: 'Job no',
            icon: <p className="font-bold text-lg text-text-subdued">#</p>,
        },
        type: {
            title: 'Type',
            icon: <Layers2 size={20} className="text-text-subdued" />,
        },
        thumbnail: {
            title: 'Thumbnail',
            icon: <GalleryThumbnails size={20} className="text-text-subdued" />,
        },
        displayName: {
            title: 'Display name',
            icon: <AtSign size={20} className="text-text-subdued" />,
        },
        description: {
            title: 'Description',
            icon: <Text size={20} className="text-text-subdued" />,
        },
        attachmentUrls: {
            title: 'Attachments',
            icon: <Paperclip size={20} className="text-text-subdued" />,
        },
        clientName: {
            title: 'Client name',
            icon: <Handshake size={20} className="text-text-subdued" />,
        },
        incomeCost: {
            title: 'Income cost',
            icon: <DollarSign size={20} className="text-text-subdued" />,
        },
        staffCost: {
            title: 'Staff cost',
            icon: <p className="font-semibold text-lg text-text-subdued">đ</p>,
        },
        assignee: {
            title: 'Assignees',
            icon: <UsersRound size={20} className="text-text-subdued" />,
        },
        paymentChannel: {
            title: 'Payment channel',
            icon: <Landmark size={20} className="text-text-subdued" />,
        },
        status: {
            title: 'Status',
            icon: <Loader size={20} className="text-text-subdued" />,
        },
        isPaid: {
            title: 'Paid status',
            icon: <BanknoteArrowUp size={20} className="text-text-subdued" />,
        },
        dueAt: {
            title: 'Due on',
            icon: <CalendarClock size={20} className="text-text-subdued" />,
        },
        completedAt: {
            title: 'Completed at',
            icon: <Calendar size={20} className="text-text-subdued" />,
        },
        createdAt: {
            title: 'Created at',
            icon: <Calendar size={20} className="text-text-subdued" />,
        },
        updatedAt: {
            title: 'Updated at',
            icon: <Calendar size={20} className="text-text-subdued" />,
        },
        action: {
            title: 'Actions',
            icon: <Hand size={20} className="text-text-subdued" />,
        },
    }

    // Auto-generate headerColumns from JobCols
    const headerColumns: THeaderColumns = (
        Object.keys(columnMeta) as JobColumn[]
    ).map((key) => ({
        key,
        ...columnMeta[key],
    }))
    const canShowCols =
        userRole === RoleEnum.ADMIN
            ? USER_CONFIG_VALUES.allJobColumns.admin
            : USER_CONFIG_VALUES.allJobColumns.user
    const finalColumns = headerColumns.filter((col) => {
        return canShowCols.includes(col.key)
    })

    const handleSwitch = (colKey: string, isSelected: boolean) => {
        if (showColumns) {
            if (!isSelected) {
                const newCols = showColumns?.filter((item) => item !== colKey)
                updateConfigMutate({
                    code: USER_CONFIG_KEYS.jobShowColumns,
                    data: {
                        value: JSON.stringify(newCols),
                    },
                })
            } else {
                const newCols = [...showColumns, colKey]
                updateConfigMutate({
                    code: USER_CONFIG_KEYS.jobShowColumns,
                    data: {
                        value: JSON.stringify(newCols),
                    },
                })
            }
        }
    }

    return (
        <Drawer
            open={isOpen}
            title="View columns"
            width={450}
            maskClosable
            closeIcon={<ArrowLeft size={16} />}
            mask={true}
            onClose={onClose}
            classNames={{
                body: '!py-3 !px-5',
            }}
        >
            <div className="relative size-full">
                {isLoading && (
                    <div className="absolute bg-background opacity-50 size-full z-20 flex items-center justify-center">
                        <Spinner size="lg" className="opacity-100!" />
                    </div>
                )}
                <div className="flex items-center justify-between">
                    <p className="font-medium text-text-subdued">
                        Show columns
                    </p>
                    <button
                        className="cursor-pointer hover:underline underline-offset-2 transition duration-150"
                        onClick={() => {
                            const canShowAll =
                                showColumns && showColumns.length === 0
                            if (canShowAll) {
                                const data =
                                    userRole === RoleEnum.ADMIN
                                        ? USER_CONFIG_VALUES.allJobColumns.admin
                                        : USER_CONFIG_VALUES.allJobColumns.user
                                updateConfigMutate({
                                    code: USER_CONFIG_KEYS.jobShowColumns,
                                    data: {
                                        value: JSON.stringify(data),
                                    },
                                })
                            } else {
                                updateConfigMutate({
                                    code: USER_CONFIG_KEYS.jobShowColumns,
                                    data: {
                                        value: JSON.stringify([]),
                                    },
                                })
                            }
                        }}
                    >
                        <p className="font-medium text-text-subdued">
                            {showColumns?.length === 0
                                ? 'Show all'
                                : 'Hide all'}
                        </p>
                    </button>
                </div>
                <div className="mt-2">
                    {finalColumns.map((col, idx) => {
                        const isSelected =
                            showColumns?.includes(col.key as JobColumnKey) ??
                            false

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
                                <ViewColumnSwitch
                                    colKey={col.key}
                                    isSelected={isSelected}
                                    onSwitch={handleSwitch}
                                />
                            </div>
                        )
                    })}
                </div>
            </div>
        </Drawer>
    )
}
