import { Divider, Slider } from '@heroui/react'
import { Avatar, Image } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import { Handshake, Landmark, Layers2, Loader, UsersRound } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
    useJobStatuses,
    useJobTypes,
    usePaymentChannels,
    useUsers,
} from '@/lib/queries'
import { PAID_STATUS_ARRAY } from '@/lib/utils'
import { type TJobFiltersInput } from '@/lib/validationSchemas'
import { HeroCard, HeroCardBody, HeroCardHeader } from '../ui/hero-card'
import { HeroDateRangePicker } from '../ui/hero-date-picker'
import { HeroNumberInput } from '../ui/hero-number-input'
import { HeroSelect, HeroSelectItem } from '../ui/hero-select'

type FilterViewProps = {
    filters: TJobFiltersInput
    onFiltersChange: (filters: TJobFiltersInput) => void
}

export default function FilterView({
    filters: defaultFilters,
    onFiltersChange,
}: FilterViewProps) {
    // --- Data Hooks ---
    const { data: jobStatuses, isLoading: loadingJobStatuses } =
        useJobStatuses()
    const { data: paymentChannels, isLoading: loadingPaymentChannels } =
        usePaymentChannels()
    const { data: jobTypes, isLoading: loadingJobTypes } = useJobTypes()
    const { data: users, isLoading: loadingUsers } = useUsers()

    // --- Local State ---
    const [filters, setFilters] = useState<TJobFiltersInput>(defaultFilters)
    console.log(filters)

    // Sync local state if parent defaultFilters change (optional, depends on use case)
    useEffect(() => {
        setFilters(defaultFilters)
    }, [defaultFilters])

    // --- Helper: Centralized Filter Updater ---
    // Updates local state and notifies parent immediately
    const updateFilter = (updates: Partial<TJobFiltersInput>) => {
        setFilters((prev) => {
            const newFilters = { ...prev, ...updates }
            onFiltersChange(newFilters)
            return newFilters
        })
    }

    // --- Handlers ---

    const handleDateChange = (
        keyPrefix: 'dueAt' | 'createdAt' | 'completedAt' | 'finishedAt',
        val: { start: Dayjs; end: Dayjs } | null
    ) => {
        const start = val ? val.start.format('YYYY-MM-DD') : undefined
        const end = val ? val.end.format('YYYY-MM-DD') : undefined

        updateFilter({
            [`${keyPrefix}From`]: start,
            [`${keyPrefix}To`]: end,
        })
    }

    const handleReset = (keys: (keyof TJobFiltersInput)[]) => {
        const updates: Partial<TJobFiltersInput> = {}
        keys.forEach((k) => {
            updates[k] = undefined // or null, depending on your API requirement
        })
        updateFilter(updates)
    }

    // Generic handler for Selects that return a Set or string
    const handleSelectChange = (
        key: keyof TJobFiltersInput,
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const value = e.target.value
        // If your API expects an array of strings for "in" queries:
        // HeroUI Select usually returns a comma separated string for multiple
        updateFilter({ [key]: value ? value.split(',') : undefined })
    }

    return (
        <div className="relative size-full">
            <div className="pb-10">
                {/* ---------------- DATE RANGE SECTION ---------------- */}
                <HeroCard className="p-0 border-none shadow-none">
                    <HeroCardHeader className="px-1.5">
                        <p className="font-medium text-base">Date range</p>
                    </HeroCardHeader>
                    <HeroCardBody className="pt-0 px-2 space-y-6">
                        <HeroDateRangePicker
                            label="Create at"
                            value={
                                filters.createdAtFrom && filters.createdAtTo
                                    ? {
                                          start: dayjs(filters.createdAtFrom),
                                          end: dayjs(filters.createdAtTo),
                                      }
                                    : null
                            }
                            isClearable
                            onChange={(range) =>
                                handleDateChange('createdAt', range)
                            }
                            variant="bordered"
                            labelPlacement="outside"
                        />
                        <HeroDateRangePicker
                            label="Due in"
                            value={
                                filters.dueAtFrom && filters.dueAtTo
                                    ? {
                                          start: dayjs(filters.dueAtFrom),
                                          end: dayjs(filters.dueAtTo),
                                      }
                                    : null
                            }
                            isClearable
                            onChange={(range) =>
                                handleDateChange('dueAt', range)
                            }
                            variant="bordered"
                            labelPlacement="outside"
                        />
                        <HeroDateRangePicker
                            label="Completed at"
                            value={
                                filters.completedAtFrom && filters.completedAtTo
                                    ? {
                                          start: dayjs(filters.completedAtFrom),
                                          end: dayjs(filters.completedAtTo),
                                      }
                                    : null
                            }
                            isClearable
                            onChange={(range) =>
                                handleDateChange('completedAt', range)
                            }
                            variant="bordered"
                            labelPlacement="outside"
                        />
                        <HeroDateRangePicker
                            label="Finish at"
                            value={
                                filters.finishedAtFrom && filters.finishedAtTo
                                    ? {
                                          start: dayjs(filters.finishedAtFrom),
                                          end: dayjs(filters.finishedAtTo),
                                      }
                                    : null
                            }
                            isClearable
                            onChange={(range) =>
                                handleDateChange('finishedAt', range)
                            }
                            variant="bordered"
                            labelPlacement="outside"
                        />
                    </HeroCardBody>
                </HeroCard>

                <Divider className="my-2" />

                {/* ---------------- COST SECTION ---------------- */}
                <HeroCard className="p-0 border-none shadow-none">
                    <HeroCardHeader className="px-1.5">
                        <p className="font-medium text-base">Cost range</p>
                    </HeroCardHeader>
                    <HeroCardBody className="pt-0 px-2 space-y-4">
                        {/* Income Cost */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <p className="font-medium text-text-default text-sm">
                                    Income cost
                                </p>
                                <button
                                    onClick={() =>
                                        handleReset([
                                            'incomeCostMin',
                                            'incomeCostMax',
                                        ])
                                    }
                                    className="link cursor-pointer hover:underline underline-offset-2 transition duration-150"
                                >
                                    <p className="font-medium text-text-subdued">
                                        Reset
                                    </p>
                                </button>
                            </div>
                            <div className="space-y-3">
                                <Slider
                                    step={50}
                                    minValue={0}
                                    maxValue={9999999}
                                    formatOptions={{
                                        style: 'currency',
                                        currency: 'USD',
                                    }}
                                    showTooltip
                                    // Handle string to number conversion with fallbacks
                                    value={[
                                        Number(filters.incomeCostMin ?? 0),
                                        Number(
                                            filters.incomeCostMax ?? 9999999
                                        ),
                                    ]}
                                    onChange={(val) => {
                                        if (Array.isArray(val)) {
                                            updateFilter({
                                                incomeCostMin:
                                                    val[0].toString(),
                                                incomeCostMax:
                                                    val[1].toString(),
                                            })
                                        }
                                    }}
                                    startContent={
                                        <HeroNumberInput
                                            value={filters.incomeCostMin}
                                            onValueChange={(val) =>
                                                updateFilter({
                                                    incomeCostMin: val,
                                                })
                                            }
                                            placeholder="0"
                                            size="sm"
                                            hideStepper
                                        />
                                    }
                                    endContent={
                                        <HeroNumberInput
                                            value={filters.incomeCostMax}
                                            onValueChange={(val) =>
                                                updateFilter({
                                                    incomeCostMax: val,
                                                })
                                            }
                                            placeholder="Max"
                                            size="sm"
                                            hideStepper
                                        />
                                    }
                                />
                            </div>
                        </div>

                        {/* Staff Cost */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <p className="font-medium text-text-default text-sm">
                                    Staff cost
                                </p>
                                <button
                                    onClick={() =>
                                        handleReset([
                                            'staffCostMin',
                                            'staffCostMax',
                                        ])
                                    }
                                    className="link cursor-pointer hover:underline underline-offset-2 transition duration-150"
                                >
                                    <p className="font-medium text-text-subdued">
                                        Reset
                                    </p>
                                </button>
                            </div>
                            <div className="space-y-3">
                                <Slider
                                    step={50}
                                    minValue={0}
                                    maxValue={9999999}
                                    formatOptions={{
                                        style: 'currency',
                                        currency: 'USD',
                                    }}
                                    showTooltip
                                    value={[
                                        Number(filters.staffCostMin ?? 0),
                                        Number(filters.staffCostMax ?? 9999999),
                                    ]}
                                    onChange={(val) => {
                                        if (Array.isArray(val)) {
                                            updateFilter({
                                                staffCostMin: val[0].toString(),
                                                staffCostMax: val[1].toString(),
                                            })
                                        }
                                    }}
                                    startContent={
                                        <HeroNumberInput
                                            value={filters.staffCostMin}
                                            onValueChange={(val) =>
                                                updateFilter({
                                                    staffCostMin: val,
                                                })
                                            }
                                            placeholder="0"
                                            size="sm"
                                            hideStepper
                                        />
                                    }
                                    endContent={
                                        <HeroNumberInput
                                            value={filters.staffCostMax}
                                            onValueChange={(val) =>
                                                updateFilter({
                                                    staffCostMax: val,
                                                })
                                            }
                                            placeholder="Max"
                                            size="sm"
                                            hideStepper
                                        />
                                    }
                                />
                            </div>
                        </div>
                    </HeroCardBody>
                </HeroCard>

                <Divider className="my-2" />

                {/* ---------------- PAYMENT SECTION ---------------- */}
                <HeroCard className="p-0 border-none shadow-none">
                    <HeroCardHeader className="px-1.5 justify-start">
                        <Landmark size={14} className="text-text-default" />
                        <p className="font-medium text-base">Payment</p>
                    </HeroCardHeader>
                    <HeroCardBody className="pt-0 px-2 space-y-4">
                        {/* Payment Channel */}
                        <div className="mt-2 space-y-2">
                            <div className="flex items-center justify-between">
                                <p className="font-medium text-text-default">
                                    Payment channel
                                </p>
                                <button
                                    onClick={() =>
                                        handleReset(['paymentChannelIds'])
                                    }
                                    className="link cursor-pointer hover:underline underline-offset-2 transition duration-150"
                                >
                                    <p className="font-medium text-text-subdued">
                                        Reset
                                    </p>
                                </button>
                            </div>
                            <HeroSelect
                                isLoading={loadingPaymentChannels}
                                id="paymentChannelIds"
                                name="paymentChannelIds"
                                selectedKeys={
                                    filters.paymentChannelIds
                                        ? new Set(filters.paymentChannelIds)
                                        : new Set([])
                                }
                                placeholder="Select channels"
                                selectionMode="multiple"
                                variant="bordered"
                                size="lg"
                                onChange={(e) =>
                                    handleSelectChange('paymentChannelIds', e)
                                }
                                renderValue={(selectedItems) => (
                                    <ul className="flex line-clamp-1 truncate">
                                        {selectedItems.map((item, idx) => {
                                            const data = paymentChannels?.find(
                                                (d) => d.id === item.key
                                            )
                                            if (!data) return null
                                            return (
                                                <span
                                                    key={item.key}
                                                    className="pr-1"
                                                >
                                                    {data.displayName}
                                                    {idx <
                                                    selectedItems.length - 1
                                                        ? ','
                                                        : ''}
                                                </span>
                                            )
                                        })}
                                        {selectedItems.length === 0 && (
                                            <span className="text-gray-400">
                                                Select channels
                                            </span>
                                        )}
                                    </ul>
                                )}
                            >
                                {paymentChannels?.map((pc) => (
                                    <HeroSelectItem
                                        key={pc.id}
                                        textValue={pc.displayName}
                                    >
                                        <div className="flex items-center justify-start gap-2">
                                            <div
                                                className="size-2 rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        pc.hexColor ||
                                                        'transparent',
                                                }}
                                            />
                                            <p>{pc.displayName}</p>
                                        </div>
                                    </HeroSelectItem>
                                ))}
                            </HeroSelect>
                        </div>

                        {/* Payment Status (Paid/Unpaid) */}
                        <div className="mt-2 space-y-2">
                            <div className="flex items-center justify-between">
                                <p className="font-medium text-text-default">
                                    Status
                                </p>
                                <button
                                    onClick={() =>
                                        handleReset(['paymentStatus'])
                                    }
                                    className="link cursor-pointer hover:underline underline-offset-2 transition duration-150"
                                >
                                    <p className="font-medium text-text-subdued">
                                        Reset
                                    </p>
                                </button>
                            </div>
                            <HeroSelect
                                id="paymentStatus"
                                name="paymentStatus"
                                // Assuming paymentStatus in filters is a single string or array.
                                // Since PAID_STATUS_ARRAY is usually strict, assuming simple Select here.
                                selectedKeys={
                                    filters.paymentStatus
                                        ? new Set([filters.paymentStatus])
                                        : new Set([])
                                }
                                placeholder="Select payment status"
                                variant="bordered"
                                size="lg"
                                onChange={(e) =>
                                    updateFilter({
                                        paymentStatus: e.target.value,
                                    })
                                }
                                renderValue={(selectedItems) => {
                                    const item = PAID_STATUS_ARRAY?.find(
                                        (d) => d.title === selectedItems[0]?.key
                                    )
                                    if (!item)
                                        return (
                                            <span className="text-gray-400">
                                                Select status
                                            </span>
                                        )
                                    return (
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-2 h-2 rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        item.hexColor ||
                                                        'transparent',
                                                }}
                                            />
                                            <span>{item.title}</span>
                                        </div>
                                    )
                                }}
                            >
                                {PAID_STATUS_ARRAY?.map((pStatus) => (
                                    <HeroSelectItem
                                        key={pStatus.title}
                                        textValue={pStatus.title}
                                    >
                                        <div className="flex items-center justify-start gap-2">
                                            <div
                                                className="size-2 rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        pStatus.hexColor ||
                                                        'transparent',
                                                }}
                                            />
                                            <p>{pStatus.title}</p>
                                        </div>
                                    </HeroSelectItem>
                                ))}
                            </HeroSelect>
                        </div>
                    </HeroCardBody>
                </HeroCard>

                <Divider className="my-2" />

                {/* ---------------- ATTRIBUTES SECTION ---------------- */}
                <HeroCard className="p-0 border-none shadow-none">
                    <HeroCardBody className="px-2 space-y-4">
                        {/* Job Statuses */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center justify-start gap-1.5">
                                    <Loader
                                        size={14}
                                        className="text-text-default"
                                    />
                                    <p className="font-medium text-base">
                                        Status
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleReset(['statusIds'])}
                                    className="link cursor-pointer hover:underline"
                                >
                                    <p className="font-medium text-text-subdued">
                                        Reset
                                    </p>
                                </button>
                            </div>
                            <HeroSelect
                                isLoading={loadingJobStatuses}
                                selectionMode="multiple"
                                selectedKeys={
                                    filters.statusIds
                                        ? new Set(filters.statusIds)
                                        : new Set([])
                                }
                                onChange={(e) =>
                                    handleSelectChange('statusIds', e)
                                }
                                placeholder="Select statuses"
                                variant="bordered"
                                size="lg"
                                renderValue={(items) => (
                                    <ul className="flex line-clamp-1 truncate">
                                        {items.map((item, idx) => {
                                            const d = jobStatuses?.find(
                                                (js) => js.id === item.key
                                            )
                                            if (!d) return null
                                            return (
                                                <span
                                                    key={item.key}
                                                    className="pr-1"
                                                >
                                                    {d.displayName}
                                                    {idx < items.length - 1
                                                        ? ','
                                                        : ''}
                                                </span>
                                            )
                                        })}
                                        {items.length === 0 && (
                                            <span className="text-gray-400">
                                                Select statuses
                                            </span>
                                        )}
                                    </ul>
                                )}
                            >
                                {jobStatuses?.map((js) => (
                                    <HeroSelectItem
                                        key={js.id}
                                        textValue={js.displayName}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="size-2 rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        js.hexColor ||
                                                        'transparent',
                                                }}
                                            />
                                            <p>{js.displayName}</p>
                                        </div>
                                    </HeroSelectItem>
                                ))}
                            </HeroSelect>
                        </div>

                        {/* Assignees */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center justify-start gap-1.5">
                                    <UsersRound
                                        size={14}
                                        className="text-text-default"
                                    />
                                    <p className="font-medium text-base">
                                        Assignees
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleReset(['assigneeIds'])}
                                    className="link cursor-pointer hover:underline"
                                >
                                    <p className="font-medium text-text-subdued">
                                        Reset
                                    </p>
                                </button>
                            </div>
                            <HeroSelect
                                isLoading={loadingUsers}
                                selectionMode="multiple"
                                selectedKeys={
                                    filters.assigneeIds
                                        ? new Set(filters.assigneeIds)
                                        : new Set([])
                                }
                                onChange={(e) =>
                                    handleSelectChange('assigneeIds', e)
                                }
                                placeholder="Select assignees"
                                variant="bordered"
                                size="lg"
                                classNames={{ base: 'overflow-hidden' }}
                                renderValue={(items) => (
                                    <div className="flex line-clamp-1 truncate gap-1.5">
                                        <Avatar.Group
                                            max={{
                                                count: 5,
                                                style: {
                                                    color: '#f56a00',
                                                    backgroundColor: '#fde3cf',
                                                },
                                            }}
                                        >
                                            {items.map((item) => {
                                                const u = users?.find(
                                                    (d) => d.id === item.key
                                                )
                                                if (!u) return null
                                                return (
                                                    <Avatar
                                                        key={item.key}
                                                        src={u.avatar as string}
                                                        style={{
                                                            borderColor:
                                                                u.department
                                                                    ?.hexColor ||
                                                                'transparent',
                                                        }}
                                                    />
                                                )
                                            })}
                                        </Avatar.Group>
                                        {items.length === 0 && (
                                            <span className="text-gray-400 self-center">
                                                Select assignees
                                            </span>
                                        )}
                                    </div>
                                )}
                            >
                                {users?.map((usr) => (
                                    <HeroSelectItem
                                        key={usr.id}
                                        textValue={usr.displayName}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="size-9">
                                                <Image
                                                    src={usr.avatar as string}
                                                    rootClassName="!size-10 rounded-full"
                                                    className="size-full! rounded-full p-px border-2 object-cover"
                                                    preview={false}
                                                    style={{
                                                        borderColor:
                                                            usr.department
                                                                ?.hexColor ||
                                                            'transparent',
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <p className="font-normal">
                                                    {usr.displayName}
                                                </p>
                                                <p className="text-text-muted">
                                                    {usr.email}
                                                </p>
                                            </div>
                                        </div>
                                    </HeroSelectItem>
                                ))}
                            </HeroSelect>
                        </div>

                        {/* Job Types */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center justify-start gap-1.5">
                                    <Layers2
                                        size={14}
                                        className="text-text-default"
                                    />
                                    <p className="font-medium text-base">
                                        Type
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleReset(['typeIds'])}
                                    className="link cursor-pointer hover:underline"
                                >
                                    <p className="font-medium text-text-subdued">
                                        Reset
                                    </p>
                                </button>
                            </div>
                            <HeroSelect
                                isLoading={loadingJobTypes}
                                selectionMode="multiple"
                                selectedKeys={
                                    filters.typeIds
                                        ? new Set(filters.typeIds)
                                        : new Set([])
                                }
                                onChange={(e) =>
                                    handleSelectChange('typeIds', e)
                                }
                                placeholder="Select types"
                                variant="bordered"
                                size="lg"
                                renderValue={(items) => (
                                    <ul className="flex line-clamp-1 truncate">
                                        {items.map((item, idx) => {
                                            const d = jobTypes?.find(
                                                (js) => js.id === item.key
                                            )
                                            if (!d) return null
                                            return (
                                                <span
                                                    key={item.key}
                                                    className="pr-1"
                                                >
                                                    {d.displayName}
                                                    {idx < items.length - 1
                                                        ? ','
                                                        : ''}
                                                </span>
                                            )
                                        })}
                                        {items.length === 0 && (
                                            <span className="text-gray-400">
                                                Select types
                                            </span>
                                        )}
                                    </ul>
                                )}
                            >
                                {jobTypes?.map((jt) => (
                                    <HeroSelectItem
                                        key={jt.id}
                                        textValue={jt.displayName}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="size-2 rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        jt.hexColor ||
                                                        'transparent',
                                                }}
                                            />
                                            <p>{jt.displayName}</p>
                                        </div>
                                    </HeroSelectItem>
                                ))}
                            </HeroSelect>
                        </div>

                        {/* Client (Uses JobStatuses hook in original code? Assuming placeholder logic for now) */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center justify-start gap-1.5">
                                    <Handshake
                                        size={14}
                                        className="text-text-default"
                                    />
                                    <p className="font-medium text-base">
                                        Client name
                                    </p>
                                </div>
                                {/* Note: logic missing for clientIds in validation schema usually, but added support */}
                                <button
                                    onClick={() =>
                                        handleReset(['clientIds'] as any)
                                    }
                                    className="link cursor-pointer hover:underline"
                                >
                                    <p className="font-medium text-text-subdued">
                                        Reset
                                    </p>
                                </button>
                            </div>
                            {/* NOTE: Original code used jobStatuses for client select. 
                                Placeholder kept as per original request, but mapped to 'clientIds' */}
                            <HeroSelect
                                isLoading={loadingJobStatuses}
                                selectionMode="multiple"
                                onChange={(e) =>
                                    handleSelectChange('clientIds' as any, e)
                                }
                                placeholder="Select clients"
                                variant="bordered"
                                size="lg"
                            >
                                {jobStatuses?.map((js) => (
                                    <HeroSelectItem key={js.id}>
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="size-2 rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        js.hexColor ||
                                                        'transparent',
                                                }}
                                            />
                                            <p>{js.displayName}</p>
                                        </div>
                                    </HeroSelectItem>
                                ))}
                            </HeroSelect>
                        </div>
                    </HeroCardBody>
                </HeroCard>
            </div>
        </div>
    )
}
