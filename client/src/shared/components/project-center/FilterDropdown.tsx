import {
    jobStatusesListOptions,
    jobTypesListOptions,
    listUserOptions,
    usersListOptions, // Imported your user query
} from '@/lib/queries'
import { JobFiltersSchema, jobFiltersSchema } from '@/lib/validationSchemas'
import {
    Button,
    Chip,
    DateRangePicker,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Input,
    Popover,
    PopoverContent,
    PopoverTrigger,
    ScrollShadow,
    Select,
    SelectItem,
} from '@heroui/react'
import { getLocalTimeZone, parseAbsoluteToLocal } from '@internationalized/date'
import { useSuspenseQueries } from '@tanstack/react-query'
import { AlertCircle, ChevronDown, Filter, Plus, Trash2 } from 'lucide-react'
import React, { useState, useEffect, useMemo } from 'react'

// --- 1. Configuration & Types ---

type FilterType = 'text' | 'select' | 'date_range' | 'number_range'

interface FieldDef {
    key: string
    label: string
    dtoKeys: (keyof JobFiltersSchema)[]
}

interface FilterConfig {
    key: string
    label: string
    type: FilterType
    fields?: FieldDef[]
    dtoKeys?: (keyof JobFiltersSchema)[]
    options?: { label: string; value: string }[]
}

interface ActiveFilter {
    id: string
    configKey: string
    fieldKey?: string
    value: any
}

interface FilterBuilderProps {
    defaultFilters?: Partial<JobFiltersSchema>
    onApply: (filters: JobFiltersSchema) => void
    className?: string
}

// --- 2. Main Component ---

export const FilterBuilder: React.FC<FilterBuilderProps> = ({
    onApply,
    defaultFilters,
    className,
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([])
    const [errors, setErrors] = useState<string[]>([])

    // --- Data Fetching ---
    const [
        {
            data: { jobStatuses },
        },
        {
            data: { jobTypes },
        },
        {
            data: { users },
        }, // Destructure users data
    ] = useSuspenseQueries({
        queries: [
            { ...jobStatusesListOptions() },
            { ...jobTypesListOptions() },
            { ...usersListOptions() }, // Add user query here
        ],
    })

    // --- Configuration ---
    const FILTER_CONFIG: FilterConfig[] = useMemo(() => {
        // Transform API data to options
        const statusOptions = jobStatuses.map((item) => ({
            label: item.displayName,
            value: item.code,
        }))
        const typeOptions = jobTypes.map((item) => ({
            label: item.displayName,
            value: item.code,
        }))
        // Assuming 'username' is the value needed for the DTO filter
        const assigneeOptions = users.map((user) => ({
            label: user.displayName || user.username, // Fallback to username if no display name
            value: user.username,
        }))

        return [
            {
                key: 'clientName',
                label: 'Client Name',
                type: 'text',
                dtoKeys: ['clientName'],
            },
            {
                key: 'assignee',
                label: 'Assignee',
                type: 'select', // Changed from 'text' to 'select'
                dtoKeys: ['assignee'],
                options: assigneeOptions, // Pass fetched options
            },
            {
                key: 'status',
                label: 'Status',
                type: 'select',
                dtoKeys: ['status'],
                options: statusOptions,
            },
            {
                key: 'type',
                label: 'Job Type',
                type: 'select',
                dtoKeys: ['type'],
                options: typeOptions,
            },
            {
                key: 'date_group',
                label: 'Date',
                type: 'date_range',
                fields: [
                    {
                        key: 'createdAt',
                        label: 'Date Created',
                        dtoKeys: ['createdAtFrom', 'createdAtTo'],
                    },
                    {
                        key: 'dueAt',
                        label: 'Date Due',
                        dtoKeys: ['dueAtFrom', 'dueAtTo'],
                    },
                    {
                        key: 'completedAt',
                        label: 'Date Completed',
                        dtoKeys: ['completedAtFrom', 'completedAtTo'],
                    },
                    {
                        key: 'finishedAt',
                        label: 'Date Finished',
                        dtoKeys: ['finishedAtFrom', 'finishedAtTo'],
                    },
                ],
            },
            {
                key: 'cost_group',
                label: 'Cost',
                type: 'number_range',
                fields: [
                    {
                        key: 'incomeCost',
                        label: 'Income Cost',
                        dtoKeys: ['incomeCostMin', 'incomeCostMax'],
                    },
                    {
                        key: 'staffCost',
                        label: 'Staff Cost',
                        dtoKeys: ['staffCostMin', 'staffCostMax'],
                    },
                ],
            },
        ]
    }, [jobStatuses, jobTypes, users])

    // --- Effect: Rehydrate UI from defaultFilters ---
    useEffect(() => {
        if (!defaultFilters) return

        const newActiveFilters: ActiveFilter[] = []

        FILTER_CONFIG.forEach((config) => {
            // CASE A: Grouped Fields (Dates, Costs)
            if (config.fields) {
                config.fields.forEach((field) => {
                    const key1 = field.dtoKeys[0]
                    const key2 = field.dtoKeys[1]

                    const hasData =
                        defaultFilters[key1] !== undefined ||
                        defaultFilters[key2] !== undefined

                    if (hasData) {
                        let value: any = null

                        if (config.type === 'date_range') {
                            const startStr = defaultFilters[key1] as string
                            const endStr = defaultFilters[key2] as string

                            if (startStr && endStr) {
                                try {
                                    value = {
                                        start: parseAbsoluteToLocal(startStr),
                                        end: parseAbsoluteToLocal(endStr),
                                    }
                                } catch (e) {
                                    console.error('Invalid date', e)
                                }
                            }
                        } else if (config.type === 'number_range') {
                            value = {
                                min: defaultFilters[key1],
                                max: defaultFilters[key2],
                            }
                        }

                        if (value) {
                            newActiveFilters.push({
                                id: crypto.randomUUID(),
                                configKey: config.key,
                                fieldKey: field.key,
                                value,
                            })
                        }
                    }
                })
            }
            // CASE B: Simple Fields
            else if (config.dtoKeys) {
                const dtoKey = config.dtoKeys[0]
                const val = defaultFilters[dtoKey]

                if (val !== undefined && val !== null) {
                    let finalValue = val
                    // Ensure selects are hydrated as Sets
                    if (config.type === 'select') {
                        const arr = Array.isArray(val) ? val : [val]
                        finalValue = new Set(arr)
                    }

                    newActiveFilters.push({
                        id: crypto.randomUUID(),
                        configKey: config.key,
                        value: finalValue,
                    })
                }
            }
        })

        if (newActiveFilters.length > 0) {
            setActiveFilters(newActiveFilters)
        }
    }, [defaultFilters, FILTER_CONFIG])

    // --- Action Handlers ---

    const handleApply = () => {
        setErrors([])
        const rawData: Record<string, any> = {}

        activeFilters.forEach((filter) => {
            const config = FILTER_CONFIG.find((c) => c.key === filter.configKey)
            if (!config || !filter.value) return

            let keys: (keyof JobFiltersSchema)[] = []
            if (config.fields && filter.fieldKey) {
                const field = config.fields.find(
                    (f) => f.key === filter.fieldKey
                )
                if (field) keys = field.dtoKeys
            } else if (config.dtoKeys) {
                keys = config.dtoKeys
            }

            if (keys.length === 0) return

            if (config.type === 'date_range' && filter.value.start) {
                const tz = getLocalTimeZone()
                if (keys[0])
                    rawData[keys[0]] = filter.value.start
                        .toDate(tz)
                        .toISOString()
                if (keys[1])
                    rawData[keys[1]] = filter.value.end.toDate(tz).toISOString()
            } else if (config.type === 'number_range') {
                if (filter.value.min && keys[0])
                    rawData[keys[0]] = filter.value.min
                if (filter.value.max && keys[1])
                    rawData[keys[1]] = filter.value.max
            } else if (config.type === 'select') {
                const val =
                    filter.value instanceof Set
                        ? Array.from(filter.value)
                        : filter.value
                if (keys[0]) rawData[keys[0]] = val
            } else {
                if (keys[0]) rawData[keys[0]] = filter.value
            }
        })

        const result = jobFiltersSchema.safeParse(rawData)

        if (!result.success) {
            const msgs = result.error.errors.map((e) => {
                const field = e.path.join('.')
                return `${field}: ${e.message}`
            })
            setErrors(msgs)
        } else {
            onApply(result.data)
            setIsOpen(false)
        }
    }

    const addFilter = (configKey: string) => {
        const config = FILTER_CONFIG.find((c) => c.key === configKey)
        const defaultFieldKey = config?.fields?.[0]?.key

        setActiveFilters((prev) => [
            ...prev,
            {
                id: crypto.randomUUID(),
                configKey,
                fieldKey: defaultFieldKey,
                value: null,
            },
        ])
    }

    const removeFilter = (id: string) => {
        setActiveFilters((prev) => prev.filter((f) => f.id !== id))
    }

    const updateFilterValue = (id: string, value: any) => {
        setActiveFilters((prev) =>
            prev.map((f) => (f.id === id ? { ...f, value } : f))
        )
    }

    const updateFilterField = (id: string, fieldKey: string) => {
        setActiveFilters((prev) =>
            prev.map((f) => (f.id === id ? { ...f, fieldKey } : f))
        )
    }

    const activeCount = activeFilters.length

    return (
        <Popover
            isOpen={isOpen}
            onOpenChange={(open) => {
                setIsOpen(open)
                if (!open) setErrors([])
            }}
            placement="bottom-start"
            offset={10}
            classNames={{ content: 'w-[680px] p-0 bg-content1' }}
        >
            <PopoverTrigger>
                <Button
                    size="sm"
                    variant="flat"
                    className={className}
                    startContent={<Filter className="text-small" size={14} />}
                    endContent={
                        <ChevronDown
                            className="text-small opacity-50"
                            size={14}
                        />
                    }
                >
                    Filter
                    {activeCount > 0 && (
                        <>
                            <div className="w-px h-4 bg-default-300 mx-1" />
                            <Chip
                                size="sm"
                                color="primary"
                                variant="solid"
                                classNames={{
                                    base: 'h-5 min-h-5 px-1 text-[10px]',
                                }}
                            >
                                {activeCount}
                            </Chip>
                        </>
                    )}
                </Button>
            </PopoverTrigger>

            <PopoverContent>
                {/* Header */}
                <div className="w-full px-4 py-3 flex justify-between items-center bg-default-50/50 border-b border-default-100">
                    <span className="text-small font-semibold text-default-700">
                        Conditions
                    </span>
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="light"
                            color="danger"
                            onPress={() => setActiveFilters([])}
                            isDisabled={activeFilters.length === 0}
                        >
                            Clear all
                        </Button>
                        <Button size="sm" color="primary" onPress={handleApply}>
                            Apply Filters
                        </Button>
                    </div>
                </div>

                {/* Errors */}
                {errors.length > 0 && (
                    <div className="mx-4 mt-3 bg-danger-50 border border-danger-200 rounded-md p-2 flex items-start gap-2 animate-appearance-in">
                        <AlertCircle
                            className="text-danger-500 mt-0.5 shrink-0"
                            size={16}
                        />
                        <div className="text-xs text-danger-600">
                            <p className="font-semibold">Validation Error</p>
                            <ul className="list-disc list-inside mt-1">
                                {errors.map((e, i) => (
                                    <li key={i}>{e}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {/* Body */}
                <ScrollShadow className="w-full max-h-[60vh] p-4 flex flex-col gap-3">
                    {activeFilters.length === 0 ? (
                        <div className="text-center py-8 text-default-400 border-2 border-dashed border-default-200 rounded-lg">
                            <p className="text-sm font-medium text-default-600">
                                No filters active
                            </p>
                            <p className="text-xs mt-1">
                                Add a condition below to narrow down your
                                results.
                            </p>
                        </div>
                    ) : (
                        activeFilters.map((filter, index) => (
                            <FilterRow
                                key={filter.id}
                                index={index}
                                filter={filter}
                                filterConfigs={FILTER_CONFIG}
                                onRemove={() => removeFilter(filter.id)}
                                onChange={(val) =>
                                    updateFilterValue(filter.id, val)
                                }
                                onFieldChange={(key) =>
                                    updateFilterField(filter.id, key)
                                }
                            />
                        ))
                    )}

                    {/* Add Button */}
                    <div className="mt-2">
                        <Dropdown>
                            <DropdownTrigger>
                                <Button
                                    startContent={
                                        <Plus
                                            className="text-default-500"
                                            size={16}
                                        />
                                    }
                                    variant="ghost"
                                    size="sm"
                                    className="justify-start text-default-500 font-normal"
                                >
                                    Add condition
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                aria-label="Add Filter"
                                onAction={(key) => addFilter(key as string)}
                                variant="faded"
                            >
                                {FILTER_CONFIG.map((config) => (
                                    <DropdownItem
                                        key={config.key}
                                        description={`Filter by ${config.label}`}
                                        startContent={
                                            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                                        }
                                    >
                                        {config.label}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </ScrollShadow>
            </PopoverContent>
        </Popover>
    )
}

// --- 3. Sub-Components (Row & Inputs) ---

interface FilterRowProps {
    index: number
    filter: ActiveFilter
    onRemove: () => void
    onChange: (value: any) => void
    onFieldChange: (fieldKey: string) => void
    filterConfigs: FilterConfig[]
}

const FilterRow: React.FC<FilterRowProps> = ({
    index,
    filter,
    onRemove,
    onChange,
    onFieldChange,
    filterConfigs,
}) => {
    const config = filterConfigs.find((c) => c.key === filter.configKey)
    if (!config) return null

    const isGroup = !!config.fields

    const getOperatorLabel = () => {
        switch (config.type) {
            case 'text':
                return 'contains'
            case 'select':
                return 'is any of'
            case 'date_range':
                return 'is between'
            case 'number_range':
                return 'is between'
            default:
                return 'is'
        }
    }

    return (
        <div className="flex items-center gap-2 text-sm animate-appearance-in group">
            {/* Logic Connector */}
            <div className="w-[45px] flex-shrink-0 text-right font-medium text-default-400 select-none text-xs">
                {index === 0 ? 'Where' : 'And'}
            </div>

            <div className="flex-grow flex items-center gap-1 pl-1 pr-1 py-1 rounded-medium border border-default-200 bg-content2/40 hover:bg-content2 transition-colors hover:border-default-300">
                {/* Field Selector (Switchable or Static) */}
                {isGroup ? (
                    <Select
                        aria-label="Select Field"
                        size="sm"
                        variant="bordered"
                        classNames={{
                            trigger:
                                'h-6 min-h-6 border-none shadow-none bg-default-100 rounded data-[hover=true]:bg-default-200 mr-1 w-auto min-w-[130px]',
                            value: 'text-default-700 font-medium text-xs group-data-[has-value=true]:text-default-700',
                            innerWrapper: 'w-auto',
                            selectorIcon: 'text-default-400',
                        }}
                        selectedKeys={filter.fieldKey ? [filter.fieldKey] : []}
                        onSelectionChange={(keys) =>
                            onFieldChange(Array.from(keys)[0] as string)
                        }
                        disallowEmptySelection
                        renderValue={(items) =>
                            items.map((item) => item.textValue)
                        }
                    >
                        {(config.fields || []).map((f) => (
                            <SelectItem key={f.key} textValue={f.label}>
                                {f.label}
                            </SelectItem>
                        ))}
                    </Select>
                ) : (
                    <div className="flex items-center gap-2 mr-1 py-1 px-2.5 bg-default-100 border border-transparent rounded text-default-700 font-medium text-xs whitespace-nowrap">
                        {config.label}
                    </div>
                )}

                {/* Operator */}
                <span className="text-default-400 text-xs whitespace-nowrap mr-2">
                    {getOperatorLabel()}
                </span>

                {/* Input Area */}
                <div className="flex-grow min-w-[200px]">
                    <FilterInput
                        config={config}
                        value={filter.value}
                        onChange={onChange}
                    />
                </div>

                {/* Delete */}
                <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    className="text-default-300 data-[hover=true]:text-danger min-w-7 w-7 h-7"
                    onPress={onRemove}
                >
                    <Trash2 size={14} />
                </Button>
            </div>
        </div>
    )
}

const FilterInput = ({
    config,
    value,
    onChange,
}: {
    config: FilterConfig
    value: any
    onChange: (val: any) => void
}) => {
    if (config.type === 'text') {
        return (
            <Input
                size="sm"
                variant="bordered"
                classNames={{
                    inputWrapper:
                        'h-7 min-h-0 border-none shadow-none bg-transparent group-data-[focus=true]:bg-default-100',
                    input: 'text-small',
                }}
                placeholder="Type a value..."
                value={value || ''}
                onValueChange={onChange}
            />
        )
    }

    if (config.type === 'select') {
        return (
            <Select
                size="sm"
                variant="bordered"
                classNames={{
                    trigger:
                        'h-7 min-h-0 border-none shadow-none bg-transparent',
                    value: 'text-small',
                }}
                placeholder="Select options"
                selectionMode="multiple"
                // Ensure value is a Set for HeroUI Select selection
                selectedKeys={
                    value instanceof Set ? value : new Set(value || [])
                }
                onSelectionChange={(keys) => onChange(keys)}
            >
                {(config.options || []).map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                    </SelectItem>
                ))}
            </Select>
        )
    }

    if (config.type === 'date_range') {
        return (
            <DateRangePicker
                size="sm"
                variant="bordered"
                classNames={{
                    inputWrapper:
                        'h-7 min-h-0 border-none shadow-none bg-transparent',
                }}
                value={value}
                onChange={onChange}
                aria-label={config.label}
            />
        )
    }

    if (config.type === 'number_range') {
        return (
            <div className="flex items-center gap-2 px-1">
                <input
                    type="number"
                    className="w-20 bg-transparent text-sm outline-none border-b border-default-300 focus:border-primary placeholder:text-default-300 py-0.5"
                    placeholder="Min"
                    value={value?.min || ''}
                    onChange={(e) =>
                        onChange({ ...value, min: e.target.value })
                    }
                />
                <span className="text-default-400 text-xs">-</span>
                <input
                    type="number"
                    className="w-20 bg-transparent text-sm outline-none border-b border-default-300 focus:border-primary placeholder:text-default-300 py-0.5"
                    placeholder="Max"
                    value={value?.max || ''}
                    onChange={(e) =>
                        onChange({ ...value, max: e.target.value })
                    }
                />
            </div>
        )
    }

    return null
}
