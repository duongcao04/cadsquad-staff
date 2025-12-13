'use client'

import { envConfig } from '@/lib/config'
import { dateFormatter } from '@/lib/dayjs'
import { useJobStatuses } from '@/lib/queries'
import {
    currencyFormatter,
    DUE_DATE_PRESETS,
    IMAGES,
    JOB_COLUMNS,
} from '@/lib/utils'
import { TJobFiltersInput } from '@/lib/validationSchemas'
import { JobStatusDropdown, PaymentStatusDropdown } from '@/shared/components'
import { ScrollArea, ScrollBar } from '@/shared/components/ui/scroll-area'
import { useSearchParam } from '@/shared/hooks'
import { JobColumnKey, TJob, TJobStatus } from '@/shared/types'
import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownSection,
    DropdownTrigger,
    Input,
    Pagination,
    Select,
    Selection,
    SelectItem,
    SharedSelection,
    Skeleton,
    Spinner,
    Switch,
} from '@heroui/react'
import { useStore } from '@tanstack/react-store'
import { Avatar, Image } from 'antd'
import dayjs from 'dayjs'
import lodash from 'lodash'
import {
    Check,
    ChevronDownIcon,
    Columns3Cog,
    EllipsisVertical,
    EyeClosed,
    EyeIcon,
    FilePlus,
    Filter,
    RotateCcw,
    SearchIcon,
    Sheet,
    SquareChartGantt,
    SquareKanban,
    UserRoundPlus,
    X,
} from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import React from 'react'
import { JobStatusSystemTypeEnum } from '../../enums/_job-status-system-type.enum'
import { pCenterTableStore, projectCenterStore } from '../../stores'
import CountdownTimer from '../ui/countdown-timer'
import HeroCopyButton from '../ui/hero-copy-button'
import { HeroSelect, HeroSelectItem } from '../ui/hero-select'
import {
    HeroTable,
    HeroTableBody,
    HeroTableCell,
    HeroTableColumn,
    HeroTableHeader,
    HeroTableRow,
} from '../ui/hero-table'
import { HeroTooltip } from '../ui/hero-tooltip'
import ProjectCenterTableBulkActions from './ProjectCenterTableBulkActions'
import { ProjectCenterTableQuickActions } from './ProjectCenterTableQuickActions'

const ROW_PER_PAGE_OPTIONS = [
    { displayName: '5 items', value: 5 },
    { displayName: '10 items', value: 10 },
    { displayName: '15 items', value: 15 },
    { displayName: '20 items', value: 20 },
]

export const getDueDateRange = (key: string | undefined | null) => {
    if (!key) return { dueAtFrom: undefined, dueAtTo: undefined }

    const now = dayjs()

    switch (key) {
        case 'lt_1_week':
            return {
                dueAtFrom: now.toISOString(),
                dueAtTo: now.add(1, 'week').toISOString(),
            }
        case 'lt_2_weeks':
            return {
                dueAtFrom: now.toISOString(),
                dueAtTo: now.add(2, 'weeks').toISOString(),
            }
        case 'lt_3_weeks':
            return {
                dueAtFrom: now.toISOString(),
                dueAtTo: now.add(3, 'weeks').toISOString(),
            }
        case 'lt_1_month':
            return {
                dueAtFrom: now.toISOString(),
                dueAtTo: now.add(1, 'month').toISOString(),
            }
        case 'gt_1_month':
            return {
                dueAtFrom: now.add(1, 'month').toISOString(),
                dueAtTo: undefined, // "Greater than" implies no upper limit
            }
        default:
            return { dueAtFrom: undefined, dueAtTo: undefined }
    }
}

type ProjectCenterOptions = {
    fillContainerHeight?: boolean
}
type ProjectCenterTableProps = {
    data: TJob[]
    isLoading?: boolean
    onRefresh?: () => void
    currentPage?: number
    totalPages?: number
    visibleColumns: 'all' | JobColumnKey[]
    options?: ProjectCenterOptions
    showFinishItems: boolean
    searchKeywords?: string
    filters: TJobFiltersInput
    onFiltersChange?: (filters: TJobFiltersInput) => void
    onSearchKeywordsChange?: (searchKeywords: string | undefined) => void
    sortString?: string
    onSortStringChange: (sortString: string) => void
    onDownloadCsv: () => void
    onShowFinishItemsChange?: (state: boolean) => void
    openFilterDrawer: () => void
    openViewColDrawer: () => void
    openJobDetailDrawer: () => void
    onAssignMember: (jobNo: string) => void
}
export default function ProjectCenterTable({
    data,
    isLoading = false,
    visibleColumns,
    onRefresh,
    currentPage = 1,
    totalPages = 1,
    sortString,
    onSortStringChange,
    searchKeywords,
    onSearchKeywordsChange,
    filters,
    onFiltersChange,
    options = { fillContainerHeight: false },
    showFinishItems,
    onDownloadCsv,
    onShowFinishItemsChange,
    openFilterDrawer,
    openViewColDrawer,
    openJobDetailDrawer,
    onAssignMember,
}: ProjectCenterTableProps) {
    const t = useTranslations()

    const { data: jobStatuses } = useJobStatuses()

    const locale = useLocale()

    const { setSearchParams } = useSearchParam()

    const hasSearchFilter = Boolean(searchKeywords)

    const setContextItem = (value: TJob | null) => {
        return pCenterTableStore.setState((state) => ({
            ...state,
            contextItem: value,
        }))
    }

    const pagination = useStore(projectCenterStore, (state) => ({
        rowPerPage: state.limit,
        page: state.page,
        totalPages: 10,
    }))

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

    const onRowPerPageChange = (keys: SharedSelection) => {
        const value = Array.from(keys)[0]
        projectCenterStore.setState((state) => ({
            ...state,
            limit: parseInt(value.toString()),
        }))
        setSearchParams({ l: value.toString() })
    }

    const onPageChange = (page: number) => {
        projectCenterStore.setState((state) => ({ ...state, page }))
        setSearchParams({ p: page.toString() })
    }

    const headerColumns = React.useMemo(() => {
        if (visibleColumns === 'all') return JOB_COLUMNS

        return JOB_COLUMNS.filter((column) =>
            Array.from(visibleColumns ?? []).includes(column.uid)
        )
    }, [visibleColumns])

    const topContent = React.useMemo(() => {
        return (
            <div className="w-full flex flex-col gap-4">
                <div className="w-full flex justify-between gap-3 items-end">
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
                            placeholder="Search by name..."
                            startContent={
                                <div className="w-4 flex items-center justify-center">
                                    <SearchIcon
                                        className="text-small text-text-6"
                                        size={14}
                                    />
                                </div>
                            }
                            value={searchKeywords}
                            onClear={() => onSearchKeywordsChange?.(undefined)}
                            onValueChange={(value) =>
                                onSearchKeywordsChange?.(value)
                            }
                        />

                        <div className="w-px mx-3 h-5 bg-text-muted"></div>
                        <div className="flex gap-3">
                            <Button
                                startContent={
                                    <RotateCcw
                                        className="text-small"
                                        size={14}
                                    />
                                }
                                variant="bordered"
                                size="sm"
                                className="hover:shadow-SM border-border-default border-1"
                                onPress={onRefresh}
                            >
                                <span className="font-medium">Refresh</span>
                            </Button>

                            <Button
                                startContent={
                                    <Filter className="text-small" size={14} />
                                }
                                variant="bordered"
                                size="sm"
                                className="hover:shadow-SM border-border-default border-1"
                                onPress={openFilterDrawer}
                            >
                                <span className="font-medium">Filter</span>
                            </Button>

                            <Dropdown placement="bottom-start">
                                <DropdownTrigger className="hidden sm:flex">
                                    <Button
                                        endContent={
                                            <ChevronDownIcon
                                                className="text-small"
                                                size={14}
                                            />
                                        }
                                        variant="bordered"
                                        size="sm"
                                        className="hover:shadow-SM border-border-default border-1"
                                    >
                                        <span className="font-medium">
                                            View
                                        </span>
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    disallowEmptySelection
                                    aria-label="Table Columns"
                                    closeOnSelect={false}
                                    disabledKeys={
                                        new Set(['gantt_view', 'kanban_view'])
                                    }
                                    selectedKeys={new Set(['table_view'])}
                                    // onSelectionChange={setVisibleColumns}
                                >
                                    <DropdownItem
                                        key="gantt_view"
                                        startContent={
                                            <SquareChartGantt
                                                size={14}
                                                className="text-text-8"
                                            />
                                        }
                                    >
                                        Gantt
                                    </DropdownItem>
                                    <DropdownItem
                                        key="kanban_view"
                                        startContent={
                                            <SquareKanban
                                                size={14}
                                                className="text-text-8"
                                            />
                                        }
                                    >
                                        Kanban
                                    </DropdownItem>
                                    <DropdownItem
                                        key="table_view"
                                        startContent={
                                            <Sheet
                                                size={14}
                                                className="text-text-8"
                                            />
                                        }
                                    >
                                        Table
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>

                            <Dropdown
                                placement="bottom-end"
                                showArrow
                                style={{
                                    width: 300,
                                }}
                            >
                                <DropdownTrigger>
                                    <Button
                                        variant="bordered"
                                        size="sm"
                                        className="hover:shadow-SM border-border-default border-1"
                                        isIconOnly
                                    >
                                        <EllipsisVertical
                                            className="text-small"
                                            size={14}
                                        />
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    disallowEmptySelection
                                    aria-label="View settings dropdown"
                                >
                                    <DropdownSection title={t('viewSettings')}>
                                        <DropdownItem
                                            key="switch"
                                            isReadOnly
                                            classNames={{
                                                base: 'hover:!bg-background cursor-default',
                                            }}
                                            startContent={
                                                <EyeClosed
                                                    size={16}
                                                    className="text-text-8"
                                                />
                                            }
                                        >
                                            <div className="w-full flex items-center justify-between gap-3">
                                                <p>{t('hideFinishItems')}</p>
                                                {isLoading ? (
                                                    <Spinner size="sm" />
                                                ) : (
                                                    <Switch
                                                        isSelected={
                                                            showFinishItems
                                                        }
                                                        size="sm"
                                                        aria-label="Hide finish items"
                                                        endContent={<X />}
                                                        startContent={<Check />}
                                                        color="success"
                                                        onValueChange={
                                                            onShowFinishItemsChange
                                                        }
                                                    />
                                                )}
                                            </div>
                                        </DropdownItem>
                                        <DropdownItem
                                            key="columns"
                                            startContent={
                                                <Columns3Cog
                                                    size={16}
                                                    className="text-text-8"
                                                />
                                            }
                                            onPress={openViewColDrawer}
                                        >
                                            {t('viewColumns')}
                                        </DropdownItem>
                                    </DropdownSection>
                                </DropdownMenu>
                            </Dropdown>
                        </div>

                        <div className="w-px mx-3 h-5 bg-text-muted"></div>

                        <div className="flex gap-3">
                            <HeroSelect
                                selectionMode="multiple"
                                className="min-w-[130px]"
                                classNames={{
                                    trigger:
                                        'hover:shadow-SM border-border-default border-1 cursor-pointer',
                                    popoverContent: 'w-[200px]!',
                                }}
                                placeholder="Status"
                                isClearable
                                onSelectionChange={(value) => {
                                    const arrayToString =
                                        Array.from(value).join(',')
                                    onFiltersChange?.({
                                        ...filters,
                                        status: arrayToString,
                                    })
                                }}
                                renderValue={(selectedItems) => {
                                    return (
                                        <p className="text-text-7">
                                            {selectedItems.length} status
                                            {selectedItems.length > 1
                                                ? 'es'
                                                : ''}
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
                            </HeroSelect>

                            <HeroSelect
                                className="min-w-[130px]"
                                classNames={{
                                    trigger:
                                        'hover:shadow-SM border-border-default border-1 cursor-pointer',
                                    popoverContent: 'w-[200px]!',
                                }}
                                placeholder="Due in"
                                isClearable
                                onSelectionChange={(value) => {
                                    console.log(value.currentKey)
                                    const { dueAtFrom, dueAtTo } =
                                        getDueDateRange(value.currentKey)
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
                            </HeroSelect>
                        </div>

                        <div className="w-px mx-3 h-5 bg-text-muted"></div>
                        {(selectedKeys === 'all' || selectedKeys.size > 0) && (
                            <div className="flex items-center justify-start gap-3">
                                <p className="text-sm">
                                    {selectedKeys === 'all'
                                        ? 'All items selected'
                                        : `${selectedKeys.size} selected`}
                                </p>
                                <ProjectCenterTableBulkActions
                                    keys={selectedKeys}
                                />
                            </div>
                        )}
                    </div>
                    <div>
                        <Button
                            startContent={
                                <Sheet className="text-small" size={14} />
                            }
                            variant="flat"
                            size="sm"
                            className="shadow-SM"
                            onPress={onDownloadCsv}
                        >
                            <span className="font-medium">
                                Download as .csv
                            </span>
                        </Button>
                    </div>
                </div>
            </div>
        )
    }, [
        visibleColumns,
        data?.length,
        hasSearchFilter,
        selectedKeys,
        showFinishItems,
        isLoading,
        searchKeywords,
    ])

    const bottomContent = React.useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
                <Select
                    className="w-[120px]"
                    placeholder="Select rows per page"
                    variant="bordered"
                    classNames={{
                        trigger: 'shadow-SM',
                    }}
                    selectionMode="single"
                    selectedKeys={[pagination.rowPerPage.toString()]}
                    onSelectionChange={onRowPerPageChange}
                >
                    {ROW_PER_PAGE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value}>
                            {opt.displayName}
                        </SelectItem>
                    ))}
                </Select>
                <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="primary"
                    page={currentPage}
                    total={totalPages}
                    onChange={onPageChange}
                />
                <div className="hidden sm:flex w-[30%] justify-end gap-2">
                    <Button
                        isDisabled={pagination.totalPages === 1}
                        size="sm"
                        variant="flat"
                        // onPress={onPreviousPage}
                    >
                        Previous
                    </Button>
                    <Button
                        isDisabled={pagination.totalPages === 1}
                        size="sm"
                        variant="flat"
                        // onPress={onNextPage}
                    >
                        Next
                    </Button>
                </div>
            </div>
        )
    }, [selectedKeys, data?.length, pagination, hasSearchFilter])

    const renderCell: (data: TJob, columnKey: JobColumnKey) => React.ReactNode =
        React.useCallback((data: TJob, columnKey: JobColumnKey) => {
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
                                        data.thumbnailUrl ??
                                        IMAGES.loadingPlaceholder
                                    }
                                    alt="image"
                                    className="object-cover rounded-full size-full"
                                    preview={false}
                                />
                            </div>
                        </div>
                    )
                case 'clientName':
                    return <p className="line-clamp-1">{data.clientName}</p>
                case 'type':
                    return (
                        <p className="line-clamp-1">{data.type.displayName}</p>
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
                        <p className="w-[250px] line-clamp-1 font-medium">
                            {data.displayName}
                        </p>
                    )
                case 'incomeCost':
                    return (
                        <p className="font-bold text-right text-currency">
                            {currencyFormatter(data.incomeCost)}
                        </p>
                    )
                case 'staffCost':
                    return (
                        <p className="font-bold text-right text-currency">
                            {currencyFormatter(data.staffCost, 'Vietnamese')}
                        </p>
                    )
                case 'status':
                    return (
                        <div className="flex items-center justify-center z-0">
                            <JobStatusDropdown
                                jobData={data}
                                statusData={data.status as TJobStatus}
                            />
                        </div>
                    )
                case 'dueAt': {
                    const isPaused =
                        data.status.systemType ===
                            JobStatusSystemTypeEnum.TERMINATED ||
                        data.status.systemType ===
                            JobStatusSystemTypeEnum.COMPLETED
                    const targetDate = dayjs(data.dueAt)
                    return (
                        <CountdownTimer
                            targetDate={targetDate}
                            hiddenUnits={['second', 'year']}
                            paused={isPaused}
                            className="text-right!"
                        />
                    )
                }
                case 'attachmentUrls':
                    return !data.attachmentUrls?.length ? (
                        <div className="size-full flex items-center justify-center">
                            <HeroTooltip content={'Add attachment'}>
                                <Button
                                    isIconOnly
                                    variant="light"
                                    size="sm"
                                    className="size-8! flex items-center justify-center"
                                >
                                    <p className="inline-flex items-center leading-none">
                                        <FilePlus
                                            size={16}
                                            className="opacity-60"
                                        />
                                    </p>
                                </Button>
                            </HeroTooltip>
                        </div>
                    ) : (
                        <p className="w-full text-center font-semibold tracking-wide">
                            x{data.attachmentUrls.length}
                        </p>
                    )
                case 'assignee':
                    return !data.assignee.length ? (
                        <div className="size-full flex items-center justify-center">
                            <HeroTooltip content={t('assignMembers')}>
                                <Button
                                    isIconOnly
                                    variant="light"
                                    size="sm"
                                    className="size-8! flex items-center justify-center"
                                    onPress={() => onAssignMember(data.no)}
                                >
                                    <UserRoundPlus
                                        size={16}
                                        className="opacity-60"
                                    />
                                </Button>
                            </HeroTooltip>
                        </div>
                    ) : (
                        <div onClick={() => {}} className="w-fit">
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
                                        src={member.avatar}
                                    />
                                ))}
                            </Avatar.Group>
                        </div>
                    )
                case 'isPaid':
                    return <PaymentStatusDropdown jobData={data} />
                case 'paymentChannel':
                    return data.paymentChannel ? (
                        <p className="line-clamp-1">
                            {data.paymentChannel.displayName}
                        </p>
                    ) : (
                        <p>-</p>
                    )
                case 'completedAt':
                    return data.completedAt ? (
                        <span>{dateFormatter(data.completedAt)}</span>
                    ) : (
                        <span className="text-text-subdued">-</span>
                    )
                case 'createdAt':
                    return data.createdAt ? (
                        <span>{dateFormatter(data.createdAt)}</span>
                    ) : (
                        <span className="text-text-subdued">-</span>
                    )
                case 'updatedAt':
                    return data.updatedAt ? (
                        <span>{dateFormatter(data.updatedAt)}</span>
                    ) : (
                        <span className="text-text-subdued">-</span>
                    )

                case 'action':
                    return (
                        <div className="flex items-center justify-end gap-2">
                            <HeroTooltip content={t('viewDetail')}>
                                <Button
                                    isIconOnly
                                    variant="light"
                                    size="sm"
                                    className="size-8! flex items-center justify-center"
                                    onPress={() => {
                                        openJobDetailDrawer()
                                        pCenterTableStore.setState((state) => ({
                                            ...state,
                                            viewDetail: data.no,
                                        }))
                                    }}
                                >
                                    <p className="inline-flex items-center leading-none">
                                        <EyeIcon
                                            size={18}
                                            className="opacity-60"
                                        />
                                    </p>
                                </Button>
                            </HeroTooltip>
                            <HeroTooltip content={t('copyLink')}>
                                <HeroCopyButton
                                    className="size-8! flex items-center justify-center"
                                    iconSize={16}
                                    iconClassName="opacity-60"
                                    textValue={`${envConfig.NEXT_PUBLIC_URL}/${locale}/jobs/${data.no}`}
                                />
                            </HeroTooltip>
                            <ProjectCenterTableQuickActions data={data} />
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
            bottomContentPlacement="outside"
            selectedKeys={selectedKeys}
            selectionMode="multiple"
            topContent={topContent}
            sortString={sortString ?? undefined}
            onSortStringChange={onSortStringChange}
            BaseComponent={(found) => {
                return (
                    <ScrollArea className="size-full h-full! border-1 border-border p-2 rounded-md min-h-[calc(100%-150px)]">
                        <ScrollBar orientation="horizontal" />
                        <ScrollBar orientation="vertical" />
                        {found.children}
                    </ScrollArea>
                )
            }}
            // sortDescriptor={sortDescriptor}
            topContentPlacement="outside"
            onSelectionChange={setSelectedKeys}
            // onSortChange={setSortDescriptor}'
            classNames={{
                base: `${options.fillContainerHeight ? 'h-full' : ''}`,
                table: !isLoading ? 'relative' : 'relative min-h-[480px]!',
            }}
        >
            <HeroTableHeader columns={headerColumns}>
                {(column) => (
                    <HeroTableColumn
                        key={column.uid}
                        align={column.uid === 'action' ? 'center' : 'start'}
                        allowsSorting={column.sortable}
                        onContextMenu={() => {
                            setContextItem(null)
                        }}
                    >
                        {column.displayName}
                    </HeroTableColumn>
                )}
            </HeroTableHeader>
            <HeroTableBody
                emptyContent={'No items found'}
                items={isLoading ? [] : data}
                loadingContent={
                    <div className="flex flex-col gap-3 w-full mt-16">
                        {Array.from({
                            length: pagination.rowPerPage || 10,
                        }).map((_, index) => (
                            <Skeleton
                                key={index}
                                className="rounded-md w-full h-8!"
                            />
                        ))}
                    </div>
                }
                isLoading={isLoading}
            >
                {(item) => (
                    <HeroTableRow
                        key={item.id}
                        onContextMenu={() => {
                            setContextItem(item)
                        }}
                    >
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
