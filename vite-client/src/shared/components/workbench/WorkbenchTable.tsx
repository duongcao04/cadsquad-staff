import { optimizeCloudinary } from '@/lib/cloudinary'
import {
    currencyFormatter,
    IMAGES,
    INTERNAL_URLS,
    JOB_COLUMNS,
    TABLE_ROW_PER_PAGE_OPTIONS,
} from '@/lib/utils'
import { JobColumnKey, TJob } from '@/shared/types'
import {
    Button,
    Input,
    Pagination,
    Select,
    Selection,
    SelectItem,
    Skeleton,
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
import { WorkbenchTableViewProps } from './WorkbenchTableView'
import { useProfile } from '../../../lib'

type Options = {
    fillContainerHeight?: boolean
}
type Props = WorkbenchTableViewProps & {
    options?: Options
    onViewDetail: (jobNo: string) => void
    onAssignMember: (jobNo: string) => void
}
export default function WorkbenchTable({
    isDataLoading = false,
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
    options = { fillContainerHeight: false },
}: Props) {
    const { isAdmin } = useProfile()
    const hasSearchFilter = Boolean(search)

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

    const headerColumns = useMemo(() => {
        const allColumns = isAdmin
            ? JOB_COLUMNS
            : JOB_COLUMNS.filter((item) => item.uid !== 'incomeCost')
        const visibleColumns = [
            'thumbnailUrl',
            'no',
            'displayName',
            'staffCost',
            'assignee',
            'isPaid',
            'dueAt',
            'status',
            'action',
        ]

        return allColumns.filter((column) =>
            Array.from(visibleColumns ?? []).includes(column.uid)
        )
    }, [])

    const topContent = useMemo(() => {
        return (
            <div className="flex items-center justify-start gap-2">
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
                    placeholder="Search by job no, job name"
                    startContent={
                        <div className="w-4 flex items-center justify-center">
                            <SearchIcon
                                className="text-small text-text-6"
                                size={14}
                            />
                        </div>
                    }
                    value={search}
                    onClear={() => onSearchChange(undefined)}
                    onValueChange={(value) => onSearchChange(value)}
                />
                <div className="w-px mx-3 h-5 bg-text-muted"></div>
                <div className="flex gap-3">
                    <Button
                        startContent={
                            <RotateCcw className="text-small" size={14} />
                        }
                        variant="bordered"
                        size="sm"
                        className="hover:shadow-SM border-border-default border"
                        onPress={onRefresh}
                    >
                        <span className="font-medium">Refresh</span>
                    </Button>
                </div>

                <div className="w-px mx-3 h-5 bg-text-muted"></div>

                <div className="flex gap-3">
                    {/* <HeroSelect
                        selectionMode="multiple"
                        className="min-w-32.5"
                        classNames={{
                            trigger:
                                'hover:shadow-SM border-border-default border-1 cursor-pointer',
                            popoverContent: 'w-[200px]!',
                        }}
                        placeholder="Status"
                        isClearable
                        onSelectionChange={(value) => {
                            const arrayToString = Array.from(value).join(',')
                            onFiltersChange?.({
                                ...filters,
                                status: arrayToString,
                            })
                        }}
                        renderValue={(selectedItems) => {
                            return (
                                <p className="text-text-7">
                                    {selectedItems.length} status
                                    {selectedItems.length > 1 ? 'es' : ''}
                                </p>
                            )
                        }}
                    >
                        {jobStatuses.map((jobStatus) => {
                            return (
                                <HeroSelectItem key={jobStatus.code}>
                                    <div className="flex items-center justify-start gap-2">
                                        <div
                                            className="size-2 rounded-full"
                                            style={{
                                                backgroundColor:
                                                    jobStatus.hexColor
                                                        ? jobStatus.hexColor
                                                        : '#000000',
                                            }}
                                        />
                                        <p>{jobStatus.displayName}</p>
                                    </div>
                                </HeroSelectItem>
                            )
                        })}
                    </HeroSelect> */}

                    {/* <HeroSelect
                        className="min-w-32.5"
                        classNames={{
                            trigger:
                                'hover:shadow-SM border-border-default border-1 cursor-pointer',
                            popoverContent: 'w-[200px]!',
                        }}
                        placeholder="Due in"
                        isClearable
                        onSelectionChange={(value) => {
                            console.log(value.currentKey)
                            const { dueAtFrom, dueAtTo } = getDueDateRange(
                                value.currentKey
                            )
                            onFiltersChange?.({
                                ...filters,
                                dueAtFrom,
                                dueAtTo,
                            })
                        }}
                        renderValue={(selectedItems) => {
                            return (
                                <p className="text-text-7">
                                    {selectedItems[0]?.textValue}
                                </p>
                            )
                        }}
                    >
                        {DUE_DATE_PRESETS.map((dueIn) => {
                            return (
                                <HeroSelectItem key={dueIn.key}>
                                    {dueIn.label}
                                </HeroSelectItem>
                            )
                        })}
                    </HeroSelect> */}
                </div>
            </div>
        )
    }, [data.length, hasSearchFilter, selectedKeys, search, isDataLoading])

    const bottomContent = useMemo(() => {
        return (
            <div className="py-2 px-2 grid grid-cols-3 gap-5">
                <Select
                    className="w-40"
                    label="Rows per page"
                    variant="bordered"
                    classNames={{
                        trigger: 'shadow-SM',
                    }}
                    size="sm"
                    selectionMode="single"
                    defaultSelectedKeys={[pagination.limit.toString()]}
                    onSelectionChange={(keys) => {
                        onLimitChange(Number(keys.currentKey))
                    }}
                >
                    {TABLE_ROW_PER_PAGE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value}>
                            {opt.displayName}
                        </SelectItem>
                    ))}
                </Select>
                <div className="flex items-center justify-center">
                    <Pagination
                        isCompact
                        showControls
                        showShadow
                        color="primary"
                        page={pagination.page}
                        total={pagination.totalPages}
                        onChange={onPageChange}
                    />
                </div>
                <div className="hidden sm:flex w-[30%] justify-end gap-2"></div>
            </div>
        )
    }, [selectedKeys, data.length, pagination, hasSearchFilter, onLimitChange])

    const renderCell: (data: TJob, columnKey: JobColumnKey) => ReactNode =
        // eslint-disable-next-line react-hooks/preserve-manual-memoization
        useCallback((data: TJob, columnKey: JobColumnKey) => {
            const cellValue = lodash.has(data, columnKey)
                ? (data[columnKey] as string)
                : ''

            switch (columnKey) {
                case 'thumbnailUrl':
                    return (
                        <div className="flex items-center justify-center">
                            <div className="overflow-hidden rounded-full size-10">
                                <Image
                                    src={
                                        data.status.thumbnailUrl
                                            ? optimizeCloudinary(
                                                  data.status.thumbnailUrl,
                                                  { width: 120, height: 120 }
                                              )
                                            : IMAGES.loadingPlaceholder
                                    }
                                    alt="image"
                                    className="object-cover rounded-full size-full"
                                    preview={false}
                                />
                            </div>
                        </div>
                    )
                case 'no':
                    return (
                        <div className="flex items-center justify-between gap-2 group size-full">
                            <span className="uppercase">{data.no}</span>
                            <HeroTooltip content="Copy">
                                <HeroCopyButton
                                    textValue={data.no}
                                    className="opacity-70!"
                                />
                            </HeroTooltip>
                        </div>
                    )
                case 'displayName':
                    return (
                        <div className="w-62.5 flex items-center justify-start gap-4">
                            <p className="line-clamp-1 font-medium">
                                {data.displayName}
                            </p>
                            {data.isPinned && (
                                <PinIcon
                                    className="text-text-subdued"
                                    size={14}
                                />
                            )}
                        </div>
                    )
                case 'staffCost':
                    return (
                        <p className="font-bold text-right text-currency">
                            {currencyFormatter(data.staffCost)}
                        </p>
                    )
                case 'clientName':
                    return <p className="line-clamp-1">{data.clientName}</p>
                case 'type':
                    return (
                        <p className="line-clamp-1">{data.type.displayName}</p>
                    )
                case 'incomeCost':
                    return (
                        <p className="font-bold text-right text-currency">
                            {currencyFormatter(data.incomeCost)}
                        </p>
                    )
                case 'assignee':
                    return !data.assignee.length ? (
                        <div className="size-full flex items-center justify-center">
                            <HeroTooltip content="Assign members">
                                <Button
                                    isIconOnly
                                    variant="light"
                                    size="sm"
                                    className="size-8! flex items-center justify-center"
                                    onPress={() => onAssignMember(data.no)}
                                >
                                    <p className="inline-flex items-center leading-none">
                                        <UserRoundPlus
                                            size={16}
                                            className="opacity-60"
                                        />
                                    </p>
                                </Button>
                            </HeroTooltip>
                        </div>
                    ) : (
                        <div
                            onClick={() => {}}
                            className="cursor-pointer w-fit"
                        >
                            <Avatar.Group
                                max={{
                                    count: 4,
                                    style: {
                                        color: 'var(--color-primary)',
                                        backgroundColor:
                                            'var(--color-primary-50)',
                                    },
                                    popover: {
                                        styles: {
                                            body: {
                                                borderRadius: '16px',
                                            },
                                        },
                                    },
                                }}
                            >
                                {data.assignee.map((member) => (
                                    <Avatar
                                        key={member.id}
                                        src={optimizeCloudinary(member.avatar)}
                                    />
                                ))}
                            </Avatar.Group>
                        </div>
                    )
                case 'isPaid':
                    return (
                        <PaymentStatusDropdown
                            jobData={data}
                            afterChangeStatus={onRefresh}
                        />
                    )
                case 'dueAt': {
                    const isCompleted =
                        data.status.systemType ===
                        JobStatusSystemTypeEnum.COMPLETED
                    const isFinish =
                        data.status.systemType ===
                        JobStatusSystemTypeEnum.TERMINATED

                    const isPaused = isCompleted || isFinish
                    const targetDate = dayjs(data.dueAt)

                    return (
                        <div className="w-full">
                            {isPaused ? (
                                <JobFinishChip
                                    status={
                                        isCompleted ? 'completed' : 'finish'
                                    }
                                />
                            ) : (
                                <CountdownTimer
                                    targetDate={targetDate}
                                    hiddenUnits={['second', 'year']}
                                    paused={isPaused}
                                    className="text-right!"
                                />
                            )}
                        </div>
                    )
                }
                case 'status':
                    return (
                        <div className="flex items-center justify-center z-0">
                            <JobStatusDropdown
                                jobData={data}
                                statusData={data.status}
                                afterChangeStatus={onRefresh}
                            />
                        </div>
                    )
                case 'action':
                    return (
                        <div className="flex items-center justify-end gap-2">
                            <HeroTooltip content={'View details'}>
                                <Button
                                    isIconOnly
                                    variant="light"
                                    size="sm"
                                    className="size-8! flex items-center justify-center"
                                    onPress={() => onViewDetail(data.no)}
                                >
                                    <p className="inline-flex items-center leading-none">
                                        <EyeIcon
                                            size={18}
                                            className="opacity-60"
                                        />
                                    </p>
                                </Button>
                            </HeroTooltip>
                            <HeroTooltip content="Copy link">
                                <HeroCopyButton
                                    className="size-8! flex items-center justify-center"
                                    iconSize={16}
                                    iconClassName="opacity-60"
                                    textValue={INTERNAL_URLS.getJobDetailUrl(
                                        data.no
                                    )}
                                />
                            </HeroTooltip>
                            <WorkbenchTableQuickActions data={data} />
                        </div>
                    )
                default:
                    return cellValue
            }
        }, [])

    return (
        <HeroTable
            key="no"
            isHeaderSticky
            aria-label="Project center table"
            bottomContent={bottomContent}
            sortString={sort ?? undefined}
            onSortStringChange={onSortChange}
            bottomContentPlacement="outside"
            selectedKeys={selectedKeys}
            selectionMode="multiple"
            topContent={topContent}
            topContentPlacement="outside"
            selectionBehavior="replace"
            onSelectionChange={setSelectedKeys}
            onDoubleClick={() => {
                const jobNoValue = Array.from(selectedKeys)[0]
                onViewDetail(jobNoValue)
                setSelectedKeys(new Set())
            }}
            classNames={{
                base: `${options.fillContainerHeight ? 'h-full' : ''}`,
                table: 'relative',
            }}
        >
            <HeroTableHeader columns={headerColumns} suppressHydrationWarning>
                {(column) => (
                    <HeroTableColumn
                        key={column.uid}
                        align={column.uid === 'action' ? 'center' : 'start'}
                        allowsSorting={column.sortable}
                    >
                        {column.displayName}
                    </HeroTableColumn>
                )}
            </HeroTableHeader>
            <HeroTableBody
                emptyContent={'No items found'}
                items={isDataLoading ? [] : data}
                loadingContent={
                    <div className="flex flex-col gap-3 w-full mt-16">
                        {Array.from({
                            length: pagination.limit || 10,
                        }).map((_, index) => (
                            <Skeleton
                                key={index}
                                className="rounded-md w-full h-8!"
                            />
                        ))}
                    </div>
                }
                isLoading={isDataLoading}
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
