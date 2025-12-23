import { JOB_COLUMNS } from '@/lib/utils'
import type { JobColumnKey } from '@/shared/types'
import { useStore } from '@tanstack/react-store'
import { Drawer } from 'antd'
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
import { pCenterTableStore, toggleJobColumns } from '../../stores'
import { ViewColumnSwitch } from './ViewColumnSwitch'
import { useProfile } from '../../../lib'

type Props = { isOpen: boolean; onClose: () => void }

export function ViewColumnsDrawer({ isOpen, onClose }: Props) {
    const { isAdmin, isAccounting } = useProfile()

    const JOB_COLUMNS_FINAL =
        isAdmin || isAccounting
            ? JOB_COLUMNS
            : JOB_COLUMNS.filter((item) => item.uid !== 'incomeCost')

    const visibleColumns = useStore(
        pCenterTableStore,
        (state) => state.jobColumns
    )

    const columnMeta: Record<
        JobColumnKey,
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
        thumbnailUrl: {
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

    const handleSwitch = (key: JobColumnKey, isVisible: boolean) =>
        toggleJobColumns(key, isVisible)

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
                <div className="flex items-center justify-between">
                    <p className="font-medium text-text-subdued">
                        Show columns
                    </p>
                </div>
                <div className="mt-2">
                    {JOB_COLUMNS_FINAL?.map((col, idx) => {
                        const isSelected =
                            visibleColumns === 'all'
                                ? true
                                : visibleColumns?.includes(
                                      col.uid as JobColumnKey
                                  )

                        return (
                            <div
                                key={idx}
                                className="flex items-center justify-between"
                            >
                                <div className="py-2.5 flex items-center justify-start gap-3">
                                    <p className="text-text-7">
                                        {columnMeta[col.uid]?.icon}
                                    </p>
                                    <p className="text-sm font-medium text-text-7">
                                        {col.displayName}
                                    </p>
                                </div>
                                <ViewColumnSwitch
                                    colKey={col.uid}
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
