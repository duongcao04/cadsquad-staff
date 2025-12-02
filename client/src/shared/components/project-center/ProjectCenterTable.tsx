'use client'

import { envConfig } from '@/lib/config'
import { dateFormatter } from '@/lib/dayjs'
import { useConfigByCode, useUpdateConfigByCodeMutation } from '@/lib/queries'
import {
    currencyFormatter,
    IMAGES,
    JOB_COLUMNS,
    JOB_STATUS_CODES,
    USER_CONFIG_KEYS,
} from '@/lib/utils'
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
    Spinner,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Tooltip,
} from '@heroui/react'
import { useStore } from '@tanstack/react-store'
import { Avatar, Image } from 'antd'
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
import React, { useState } from 'react'
import ProjectCenterTableBulkActions from './ProjectCenterTableBulkActions'
import { ProjectCenterTableQuickActions } from './ProjectCenterTableQuickActions'
import { pCenterTableStore, projectCenterStore } from '../../stores'
import HeroCopyButton from '../ui/hero-copy-button'
import dayjs from 'dayjs'
import CountdownTimer from '../ui/countdown-timer'

const ROW_PER_PAGE_OPTIONS = [
    { displayName: '5 items', value: 5 },
    { displayName: '10 items', value: 10 },
    { displayName: '15 items', value: 15 },
    { displayName: '20 items', value: 20 },
]

type ProjectCenterOptions = {
    fillContainerHeight?: boolean
}
type Props = {
    data: TJob[]
    isLoading?: boolean
    onRefresh?: () => void
    visibleColumns: 'all' | JobColumnKey[]
    options?: ProjectCenterOptions
    openFilterDrawer: () => void
    openViewColDrawer: () => void
    openJobDetailDrawer: () => void
}
export default function ProjectCenterTable({
    data,
    visibleColumns,
    onRefresh,
    isLoading = false,
    options = { fillContainerHeight: false },
    openFilterDrawer,
    openViewColDrawer,
    openJobDetailDrawer,
}: Props) {
    const t = useTranslations()

    const locale = useLocale()

    const { setSearchParams } = useSearchParam()

    const searchKeywords = useStore(projectCenterStore, (state) => state.search)
    const hasSearchFilter = Boolean(searchKeywords)
    const [searchValue, setSearchValue] = useState('')

    const setContextItem = (value: TJob | null) => {
        return pCenterTableStore.setState((state) => ({
            ...state,
            contextItem: value,
        }))
    }

    const { value: isHideFinishItems } = useConfigByCode(
        USER_CONFIG_KEYS.hideFinishItems
    )
    const { mutateAsync: updateConfigByCodeMutate } =
        useUpdateConfigByCodeMutation()

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

    const onSearchClear = () => {
        setSearchValue('')
    }
    const onSearchChange = (value: string) => {
        setSearchValue(value)
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
                            value={searchValue}
                            onClear={onSearchClear}
                            onValueChange={onSearchChange}
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

                            <Dropdown>
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
                                                <Switch
                                                    isSelected={Boolean(
                                                        1
                                                        // parseInt(
                                                        //     isHideFinishItems
                                                        // )
                                                    )}
                                                    size="sm"
                                                    aria-label="Hide finish items"
                                                    endContent={<X />}
                                                    startContent={<Check />}
                                                    color="success"
                                                    onValueChange={(
                                                        isSelected
                                                    ) => {
                                                        updateConfigByCodeMutate(
                                                            {
                                                                code: USER_CONFIG_KEYS.hideFinishItems,
                                                                data: {
                                                                    value: isSelected
                                                                        ? '1'
                                                                        : '0',
                                                                },
                                                            }
                                                        )
                                                    }}
                                                />
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
                        >
                            <span className="font-medium">
                                Download as .csv
                            </span>
                        </Button>
                    </div>
                </div>
            </div>
        )
    }, [visibleColumns, data?.length, hasSearchFilter, selectedKeys])

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
                    page={pagination.page}
                    total={pagination.totalPages}
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
                            <Tooltip content="Copy">
                                <HeroCopyButton
                                    textValue={data.no}
                                    className="opacity-70!"
                                />
                            </Tooltip>
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
                            {currencyFormatter(data.staffCost)}
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
                    const targetDate = dayjs(data.dueAt)
                    return (
                        <CountdownTimer
                            targetDate={targetDate}
                            hiddenUnits={['second', 'year']}
                            paused={
                                data.status.code === JOB_STATUS_CODES.finish ||
                                data.status.code === JOB_STATUS_CODES.completed
                            }
                            className="text-right!"
                        />
                    )
                }
                case 'attachmentUrls':
                    return !data.attachmentUrls?.length ? (
                        <div className="size-full flex items-center justify-center">
                            <Tooltip content={'Add attachment'}>
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
                            </Tooltip>
                        </div>
                    ) : (
                        <p>{data.attachmentUrls.length} attachments</p>
                    )
                case 'assignee':
                    return !data.assignee.length ? (
                        <div className="size-full flex items-center justify-center">
                            <Tooltip content={t('assignMembers')}>
                                <Button
                                    isIconOnly
                                    variant="light"
                                    size="sm"
                                    className="size-8! flex items-center justify-center"
                                >
                                    <p className="inline-flex items-center leading-none">
                                        <UserRoundPlus
                                            size={16}
                                            className="opacity-60"
                                        />
                                    </p>
                                </Button>
                            </Tooltip>
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
                            <Tooltip content={t('viewDetail')}>
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
                            </Tooltip>
                            <Tooltip content={t('copyLink')}>
                                <HeroCopyButton
                                    className="size-8! flex items-center justify-center"
                                    iconSize={16}
                                    iconClassName="opacity-60"
                                    textValue={`${envConfig.NEXT_PUBLIC_URL}/${locale}/jobs/${data.no}`}
                                />
                            </Tooltip>
                            <ProjectCenterTableQuickActions data={data} />
                        </div>
                    )
                default:
                    return cellValue
            }
        }, [])

    return (
        <Table
            key="no"
            isHeaderSticky
            aria-label="Project center table"
            bottomContent={bottomContent}
            bottomContentPlacement="outside"
            selectedKeys={selectedKeys}
            selectionMode="multiple"
            topContent={topContent}
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
                table: 'relative',
            }}
        >
            <TableHeader columns={headerColumns}>
                {(column) => (
                    <TableColumn
                        key={column.uid}
                        align={column.uid === 'action' ? 'center' : 'start'}
                        allowsSorting={column.sortable}
                        onContextMenu={() => {
                            setContextItem(null)
                        }}
                    >
                        {column.displayName}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody
                emptyContent={'No items found'}
                items={data}
                loadingContent={<Spinner />}
                isLoading={isLoading}
            >
                {(item) => (
                    <TableRow
                        key={item.id}
                        onContextMenu={() => {
                            setContextItem(item)
                        }}
                    >
                        {(columnKey) => (
                            <TableCell>
                                {renderCell(item, columnKey as JobColumnKey)}
                            </TableCell>
                        )}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
}
