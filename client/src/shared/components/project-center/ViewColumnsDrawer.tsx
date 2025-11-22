import { Drawer } from 'antd'
import React from 'react'

import { RoleEnum } from '@/shared/enums'

import {
    useJobColumns,
    useProfile,
    useUpdateConfigByCodeMutation,
} from '@/lib/queries'
import { USER_CONFIG_KEYS, USER_CONFIG_VALUES } from '@/lib/utils'
import { JobColumn } from '@/shared/types'
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
import { useTranslations } from 'next-intl'
import { ViewColumnSwitch } from './ViewColumnSwitch'

export type THeaderColumns = {
    title: string
    key: JobColumn
    icon?: React.ReactNode
}[]
type Props = { isOpen: boolean; onClose: () => void }

export function ViewColumnsDrawer({ isOpen, onClose }: Props) {
    const t = useTranslations()
    const { jobColumns: showColumns } = useJobColumns()
    const { userRole } = useProfile()
    const { mutateAsync: updateConfigMutate, isPending: isLoading } =
        useUpdateConfigByCodeMutation()

    const columnMeta: Record<
        JobColumn,
        { title: string; icon?: React.ReactNode }
    > = {
        no: {
            title: t('jobColumns.no'),
            icon: <p className="font-bold text-lg text-defaultp5">#</p>,
        },
        type: {
            title: t('jobColumns.type'),
            icon: <Layers2 size={20} className="text-defaultp5" />,
        },
        thumbnail: {
            title: t('jobColumns.thumbnail'),
            icon: <GalleryThumbnails size={20} className="text-defaultp5" />,
        },
        displayName: {
            title: t('jobColumns.displayName'),
            icon: <AtSign size={20} className="text-defaultp5" />,
        },
        description: {
            title: t('jobColumns.description'),
            icon: <Text size={20} className="text-defaultp5" />,
        },
        attachmentUrls: {
            title: t('jobColumns.attachmentUrls'),
            icon: <Paperclip size={20} className="text-defaultp5" />,
        },
        clientName: {
            title: t('jobColumns.clientName'),
            icon: <Handshake size={20} className="text-defaultp5" />,
        },
        incomeCost: {
            title: t('jobColumns.incomeCost'),
            icon: <DollarSign size={20} className="text-defaultp5" />,
        },
        staffCost: {
            title: t('jobColumns.staffCost'),
            icon: <p className="font-semibold text-lg text-defaultp5">đ</p>,
        },
        assignee: {
            title: t('jobColumns.assignee'),
            icon: <UsersRound size={20} className="text-defaultp5" />,
        },
        paymentChannel: {
            title: t('jobColumns.paymentChannel'),
            icon: <Landmark size={20} className="text-defaultp5" />,
        },
        status: {
            title: t('jobColumns.status'),
            icon: <Loader size={20} className="text-defaultp5" />,
        },
        isPaid: {
            title: t('jobColumns.isPaid'),
            icon: <BanknoteArrowUp size={20} className="text-defaultp5" />,
        },
        dueAt: {
            title: t('jobColumns.dueAt'),
            icon: <CalendarClock size={20} className="text-defaultp5" />,
        },
        completedAt: {
            title: t('jobColumns.completedAt'),
            icon: <Calendar size={20} className="text-defaultp5" />,
        },
        createdAt: {
            title: t('jobColumns.createdAt'),
            icon: <Calendar size={20} className="text-defaultp5" />,
        },
        updatedAt: {
            title: t('jobColumns.updatedAt'),
            icon: <Calendar size={20} className="text-defaultp5" />,
        },
        action: {
            title: t('jobColumns.action'),
            icon: <Hand size={20} className="text-defaultp5" />,
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
            title={<p>{t('viewColumns')}</p>}
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
                        <Spinner size="lg" className="!opacity-100" />
                    </div>
                )}
                <div className="flex items-center justify-between">
                    <p className="font-medium text-defaultp5">
                        {t('shownStatus')}
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
                        <p className="font-medium text-defaultp5">
                            {showColumns?.length === 0
                                ? t('showAll')
                                : t('hideAll')}
                        </p>
                    </button>
                </div>
                <div className="mt-2">
                    {finalColumns.map((col, idx) => {
                        const isSelected =
                            showColumns?.includes(col.key) ?? false

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
