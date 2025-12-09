'use client'

import { optimizeCloudinary } from '@/lib/cloudinary'
import { envConfig } from '@/lib/config'
import { currencyFormatter, IMAGES, JOB_COLUMNS } from '@/lib/utils'
import { JobStatusDropdown, PaymentStatusDropdown } from '@/shared/components'
import { ScrollArea, ScrollBar } from '@/shared/components/ui/scroll-area'
import { useSearchParam } from '@/shared/hooks'
import { JobColumnKey, TJob } from '@/shared/types'
import {
    Button,
    Input,
    Pagination,
    Select,
    Selection,
    SelectItem,
    SharedSelection,
    Skeleton,
} from '@heroui/react'
import { useStore } from '@tanstack/react-store'
import { Avatar, Image } from 'antd'
import dayjs from 'dayjs'
import lodash from 'lodash'
import { EyeIcon, SearchIcon, UserRoundPlus } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import React from 'react'
import { JobStatusSystemTypeEnum } from '../../enums/_job-status-system-type.enum'
import {
    pCenterTableStore,
    projectCenterStore,
    workbenchStore,
} from '../../stores'
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
    options?: ProjectCenterOptions
    sortString: string | null
    setSortString: React.Dispatch<React.SetStateAction<string | null>>
    onViewDetail: (jobNo: string) => void
    onAssignMember: (jobNo: string) => void
}
export default function WorkbenchTable({
    isLoading = false,
    data,
    onViewDetail,
    sortString,
    setSortString,
    onAssignMember,
    options = { fillContainerHeight: false },
}: Props) {
    const t = useTranslations()

    const locale = useLocale()

    const { setSearchParams } = useSearchParam()

    const searchValue = useStore(
        workbenchStore,
        (state) => state.searchKeywords
    )
    const setSearchValue = (newValue: string) => {
        workbenchStore.setState((state) => ({
            ...state,
            searchKeywords: newValue,
        }))
    }
    const hasSearchFilter = Boolean(searchValue)

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

        return JOB_COLUMNS.filter((column) =>
            Array.from(visibleColumns ?? []).includes(column.uid)
        )
    }, [])

    const topContent = React.useMemo(() => {
        return (
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
                value={searchValue}
                onClear={onSearchClear}
                onValueChange={onSearchChange}
            />
        )
    }, [data.length, hasSearchFilter, selectedKeys, searchValue, isLoading])

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
    }, [selectedKeys, data.length, pagination, hasSearchFilter])

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
                            <HeroTooltip content={t('assignMembers')}>
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
                    return <PaymentStatusDropdown jobData={data} />
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
                case 'status':
                    return (
                        <div className="flex items-center justify-center z-0">
                            <JobStatusDropdown
                                jobData={data}
                                statusData={data.status}
                            />
                        </div>
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
                            <HeroTooltip content={t('copyLink')}>
                                <HeroCopyButton
                                    className="size-8! flex items-center justify-center"
                                    iconSize={16}
                                    iconClassName="opacity-60"
                                    textValue={`${envConfig.NEXT_PUBLIC_URL}/${locale}/jobs/${data.no}`}
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
            sortString={sortString ?? undefined}
            onSortStringChange={setSortString}
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
                    <HeroTableRow key={item.id}>
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
