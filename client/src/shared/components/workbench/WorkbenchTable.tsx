import {
    Button,
    Input,
    Pagination,
    Select,
    Selection,
    SelectItem,
    Spinner,
} from '@heroui/react'
import { useStore } from '@tanstack/react-store'
import { Avatar, Image } from 'antd'
import dayjs from 'dayjs'
import lodash from 'lodash'
import {
    EyeIcon,
    PinIcon,
    RotateCcw,
    SearchIcon,
    UserRoundPlus,
} from 'lucide-react'
import { ReactNode, useCallback, useMemo } from 'react'
import { useProfile } from '@/lib'
import { optimizeCloudinary } from '@/lib/cloudinary'
import {
    currencyFormatter,
    getAllowedJobColumns,
    IMAGES,
    TABLE_ROW_PER_PAGE_OPTIONS,
} from '@/lib/utils'
import { JobColumnKey, TJob } from '@/shared/types'
import { JobStatusSystemTypeEnum } from '../../enums/_job-status-system-type.enum'
import { pCenterTableStore } from '../../stores'
import JobFinishChip from '../chips/JobFinishChip'
import JobStatusDropdown from '../dropdowns/JobStatusDropdown'
import PaymentStatusDropdown from '../dropdowns/PaymentStatusDropdown'
import CountdownTimer from '../ui/countdown-timer'
import HeroCopyButton from '../ui/hero-copy-button'
import {
    HeroTable,
    HeroTableBody,
    HeroTableCell,
    HeroTableColumn,
    HeroTableHeader,
    HeroTableRow,
} from '../ui/hero-table'
import { HeroTooltip } from '../ui/hero-tooltip'
import { WorkbenchTableQuickActions } from '../workbench/WorkbenchTableQuickActions'
import { IPaginate } from '../../interfaces'

type Props = {
    pagination: IPaginate
    sort: string
    search?: string
    onRefresh: () => void
    onSearchChange: (newSearch?: string) => void
    onPageChange: (newPage: number) => void
    onSortChange: (newSort: string) => void
    onLimitChange: (newLimit: number) => void
    onViewDetail: (jobNo: string) => void
    onAssignMember: (jobNo: string) => void
    isLoadingData: boolean
    data: TJob[]
}
export default function WorkbenchTable({
    isLoadingData = false,
    data,
    onViewDetail,
    sort,
    search,
    onSearchChange,
    onSortChange,
    onAssignMember,
    onRefresh,
    onPageChange,
    pagination,
    onLimitChange,
}: Props) {
    const { userRole, isAdmin, isAccounting } = useProfile()
    const isAdminOrAccounting = isAdmin || isAccounting

    const selectedKeys = useStore(
        pCenterTableStore,
        (state) => state.selectedKeys
    )

    const setSelectedKeys = (keys: Selection) => {
        pCenterTableStore.setState((state) => ({
            ...state,
            selectedKeys:
                keys === 'all' ? 'all' : new Set(keys as unknown as string[]),
        }))
    }

    // 1. Centralized Header Logic using Security Helper
    const headerColumns = useMemo(() => {
        // Filter master list by role permissions
        const allowed = getAllowedJobColumns(userRole, 'all')

        // Define specific set for Workbench view
        const workbenchUids = [
            'thumbnailUrl',
            'no',
            'displayName',
            isAdminOrAccounting ? 'totalStaffCost' : 'staffCost', // Role-based dynamic UID
            'assignments',
            'isPaid',
            'dueAt',
            'status',
            'action',
        ]

        return allowed.filter((col) => workbenchUids.includes(col.uid))
    }, [userRole, isAdminOrAccounting])

    const topContent = useMemo(() => {
        return (
            <div className="flex items-center justify-start gap-2 mb-5">
                <Input
                    isClearable
                    classNames={{
                        base: 'w-[450px]',
                        mainWrapper: 'w-[450px]',
                        inputWrapper:
                            'hover:shadow-SM bg-background border-border-default border-1',
                    }}
                    variant="bordered"
                    size="sm"
                    placeholder="Search by job no, job name..."
                    startContent={
                        <SearchIcon className="text-text-6" size={14} />
                    }
                    value={search}
                    onClear={() => onSearchChange(undefined)}
                    onValueChange={(value) => onSearchChange(value)}
                />
                <div className="w-px mx-3 h-5 bg-text-muted"></div>
                <Button
                    startContent={<RotateCcw size={14} />}
                    variant="bordered"
                    size="sm"
                    className="hover:shadow-SM border-border-default border"
                    onPress={onRefresh}
                >
                    Refresh
                </Button>
            </div>
        )
    }, [search, onRefresh, onSearchChange])

    const bottomContent = useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
                <Select
                    className="w-40"
                    label="Rows per page"
                    variant="bordered"
                    size="sm"
                    selectedKeys={[pagination.limit.toString()]}
                    onSelectionChange={(keys) =>
                        onLimitChange(Number(Array.from(keys)[0]))
                    }
                >
                    {TABLE_ROW_PER_PAGE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value}>
                            {opt.displayName}
                        </SelectItem>
                    ))}
                </Select>
                <Pagination
                    isCompact
                    showControls
                    color="primary"
                    page={pagination.page}
                    total={pagination.totalPages}
                    onChange={onPageChange}
                />
                <div className="w-40" />
            </div>
        )
    }, [pagination, onPageChange, onLimitChange])

    // 2. Cell Rendering Logic
    const renderCell = useCallback(
        (item: TJob, columnKey: JobColumnKey): ReactNode => {
            const cellValue = lodash.get(item, columnKey, '')

            switch (columnKey) {
                case 'thumbnailUrl':
                    return (
                        <div className="flex items-center justify-center">
                            <div className="overflow-hidden rounded-full size-10 border border-border">
                                <Image
                                    src={
                                        item.status.thumbnailUrl
                                            ? optimizeCloudinary(
                                                  item.status.thumbnailUrl,
                                                  { width: 80, height: 80 }
                                              )
                                            : IMAGES.loadingPlaceholder
                                    }
                                    alt="thumb"
                                    className="object-cover size-full"
                                    preview={false}
                                />
                            </div>
                        </div>
                    )
                case 'no':
                    return (
                        <div className="flex items-center justify-between gap-2 group w-full">
                            <span className="uppercase font-mono text-xs">
                                {item.no}
                            </span>
                            <HeroCopyButton
                                textValue={item.no}
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                            />
                        </div>
                    )
                case 'displayName':
                    return (
                        <div className="flex items-center gap-2">
                            <p className="line-clamp-1 font-medium">
                                {item.displayName}
                            </p>
                            {item.isPinned && (
                                <PinIcon
                                    className="text-primary fill-primary"
                                    size={12}
                                />
                            )}
                        </div>
                    )
                case 'totalStaffCost':
                case 'staffCost': {
                    // Determine value based on role vs dynamic column key
                    const cost = isAdminOrAccounting
                        ? item.totalStaffCost
                        : item.staffCost
                    return (
                        <p className="font-bold text-right text-primary">
                            {currencyFormatter(cost ?? 0, 'Vietnamese')}
                        </p>
                    )
                }
                case 'assignments':
                    return !item.assignments?.length ? (
                        <div className="flex justify-center">
                            <HeroTooltip content="Assign members">
                                <Button
                                    isIconOnly
                                    variant="light"
                                    size="sm"
                                    onPress={() => onAssignMember(item.no)}
                                >
                                    <UserRoundPlus
                                        size={16}
                                        className="opacity-60"
                                    />
                                </Button>
                            </HeroTooltip>
                        </div>
                    ) : (
                        <Avatar.Group max={{ count: 3 }}>
                            {item.assignments.map((ass) => (
                                <Avatar
                                    key={ass.id}
                                    src={optimizeCloudinary(ass.user.avatar)}
                                />
                            ))}
                        </Avatar.Group>
                    )
                case 'isPaid':
                    return (
                        <PaymentStatusDropdown
                            jobData={item}
                            afterChangeStatus={onRefresh}
                        />
                    )
                case 'dueAt': {
                    const sysType = item.status.systemType
                    const isFinished =
                        sysType === JobStatusSystemTypeEnum.COMPLETED ||
                        sysType === JobStatusSystemTypeEnum.TERMINATED
                    return (
                        <div className="w-full flex justify-end">
                            {isFinished ? (
                                <JobFinishChip
                                    status={
                                        sysType ===
                                        JobStatusSystemTypeEnum.COMPLETED
                                            ? 'completed'
                                            : 'finish'
                                    }
                                />
                            ) : (
                                <CountdownTimer
                                    targetDate={dayjs(item.dueAt)}
                                    hiddenUnits={['second', 'year']}
                                    className="text-right!"
                                />
                            )}
                        </div>
                    )
                }
                case 'status':
                    return (
                        <div className="flex justify-center">
                            <JobStatusDropdown
                                jobData={item}
                                statusData={item.status}
                                afterChangeStatus={onRefresh}
                            />
                        </div>
                    )
                case 'action':
                    return (
                        <div className="flex items-center justify-end gap-1">
                            <HeroTooltip content="View detail">
                                <Button
                                    isIconOnly
                                    variant="light"
                                    size="sm"
                                    onPress={() => onViewDetail(item.no)}
                                >
                                    <EyeIcon size={18} className="opacity-60" />
                                </Button>
                            </HeroTooltip>
                            <WorkbenchTableQuickActions data={item} />
                        </div>
                    )
                default:
                    return cellValue as ReactNode
            }
        },
        [isAdminOrAccounting, onRefresh, onViewDetail, onAssignMember]
    )

    return (
        <HeroTable
            isHeaderSticky
            aria-label="Workbench table"
            bottomContent={bottomContent}
            sortString={sort}
            onSortStringChange={onSortChange}
            selectedKeys={selectedKeys}
            selectionMode="multiple"
            topContent={topContent}
            onSelectionChange={setSelectedKeys}
            onRowAction={(key) => onViewDetail(key as string)}
            classNames={{
                table: 'relative',
            }}
        >
            <HeroTableHeader columns={headerColumns}>
                {(column) => (
                    <HeroTableColumn
                        key={column.uid}
                        align={
                            [
                                'action',
                                'dueAt',
                                'totalStaffCost',
                                'staffCost',
                            ].includes(column.uid)
                                ? 'end'
                                : 'start'
                        }
                        allowsSorting={column.sortable}
                    >
                        {column.displayName}
                    </HeroTableColumn>
                )}
            </HeroTableHeader>
            <HeroTableBody
                emptyContent="No jobs found on your workbench."
                items={isLoadingData ? [] : data}
                isLoading={isLoadingData}
                loadingContent={<Spinner label="Loading workbench..." />}
            >
                {(item) => (
                    <HeroTableRow key={item.no}>
                        {(columnKey) => (
                            <HeroTableCell>
                                {renderCell(item, columnKey as JobColumnKey)}
                            </HeroTableCell>
                        )}
                    </HeroTableRow>
                )}
            </HeroTableBody>
        </HeroTable>
    )
}
