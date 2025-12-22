import React from 'react'
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
    Button,
    Input,
    Select,
    SelectItem,
    DateRangePicker,
    Accordion,
    AccordionItem,
    Chip,
    cn,
} from '@heroui/react'
import { useFormik } from 'formik'
import {
    JobFiltersSchema,
    TJobFiltersInput,
} from '../../../lib/validationSchemas'

// --- Types & Interfaces ---

interface FilterOption {
    label: string
    value: string
}

interface JobFilterDrawerProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    onApply: (filters: TJobFiltersInput) => void
    options: {
        types: FilterOption[]
        statuses: FilterOption[]
        assignees: FilterOption[]
        paymentChannels: FilterOption[]
    }
    defaultValues?: Partial<TJobFiltersInput>
}

// --- Helper Components ---

const LogicToggle = ({
    value,
    onChange,
    isVisible = true,
}: {
    value?: 'AND' | 'OR'
    onChange: (val: 'AND' | 'OR') => void
    isVisible?: boolean
}) => {
    if (!isVisible) return null

    return (
        <div className="flex items-center gap-2 text-tiny">
            <span className="text-default-400">Match:</span>
            <div className="flex bg-default-100 rounded-lg p-1">
                <button
                    type="button"
                    onClick={() => onChange('OR')}
                    className={cn(
                        'px-2 py-0.5 rounded-md text-tiny transition-colors',
                        value === 'OR' || !value
                            ? 'bg-white shadow-sm font-semibold text-black'
                            : 'text-default-500 hover:text-default-700'
                    )}
                >
                    Any
                </button>
                <button
                    type="button"
                    onClick={() => onChange('AND')}
                    className={cn(
                        'px-2 py-0.5 rounded-md text-tiny transition-colors',
                        value === 'AND'
                            ? 'bg-white shadow-sm font-semibold text-black'
                            : 'text-default-500 hover:text-default-700'
                    )}
                >
                    All
                </button>
            </div>
        </div>
    )
}

export const JobFilterDrawer: React.FC<JobFilterDrawerProps> = ({
    isOpen,
    onOpenChange,
    onApply,
    options,
    defaultValues,
}) => {
    // --- Formik Setup ---
    const formik = useFormik<TJobFiltersInput>({
        initialValues: {
            clientName: '',
            typeOperator: 'OR',
            statusOperator: 'OR',
            assigneeOperator: 'OR',
            ...defaultValues,
        },
        // Manual Zod Validation without extra libraries
        validate: (values) => {
            const result = JobFiltersSchema.safeParse(values)
            if (result.success) return {}

            // Transform Zod errors to Formik format
            const errors: any = {}
            result.error.issues.forEach((issue) => {
                const path = issue.path[0] // Simple 1-level path
                if (path) errors[path] = issue.message
            })
            return errors
        },
        onSubmit: (values) => {
            onApply(values)
            onOpenChange(false)
        },
    })

    // Helper for Date Ranges within Formik
    const handleDateChange = (val: any, prefix: string) => {
        if (val?.start && val?.end) {
            formik.setFieldValue(`${prefix}From`, val.start.toString())
            formik.setFieldValue(`${prefix}To`, val.end.toString())
        } else {
            formik.setFieldValue(`${prefix}From`, undefined)
            formik.setFieldValue(`${prefix}To`, undefined)
        }
    }

    // Helper to parse CSV string back to Set for Heroui Select
    const getSelectedKeys = (val?: string | string[]) => {
        if (!val) return new Set([])
        if (Array.isArray(val)) return new Set(val)
        return new Set(val.split(',').filter(Boolean))
    }

    const activeFiltersCount = Object.values(formik.values).filter(
        (v) => v !== undefined && v !== '' && v !== 'OR'
    ).length

    return (
        <Drawer
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="right"
            size="md"
            backdrop="blur"
            classNames={{ base: 'border-l-1 border-default-200' }}
        >
            <DrawerContent>
                {(onClose) => (
                    <>
                        <DrawerHeader className="flex flex-col gap-1 border-b border-default-200/50">
                            <div className="flex justify-between items-center">
                                <h2 className="text-large font-bold">
                                    Filters
                                </h2>
                                {activeFiltersCount > 0 && (
                                    <Chip
                                        size="sm"
                                        color="primary"
                                        variant="flat"
                                    >
                                        {activeFiltersCount} active
                                    </Chip>
                                )}
                            </div>
                        </DrawerHeader>

                        <DrawerBody className="gap-6 px-6 py-6 scrollbar-hide">
                            <form
                                onSubmit={formik.handleSubmit}
                                className="flex flex-col gap-6"
                            >
                                {/* --- Search --- */}
                                <Input
                                    name="clientName"
                                    label="Search"
                                    placeholder="Client name..."
                                    labelPlacement="outside"
                                    startContent={<SearchIcon />}
                                    variant="bordered"
                                    value={formik.values.clientName || ''}
                                    onChange={formik.handleChange}
                                />

                                {/* --- Status --- */}
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between items-end">
                                        <span className="text-small font-medium text-default-700">
                                            Status
                                        </span>
                                        <LogicToggle
                                            value={formik.values.statusOperator}
                                            onChange={(val) =>
                                                formik.setFieldValue(
                                                    'statusOperator',
                                                    val
                                                )
                                            }
                                            isVisible={!!formik.values.status}
                                        />
                                    </div>
                                    <Select
                                        name="status"
                                        selectionMode="multiple"
                                        placeholder="Select status"
                                        variant="bordered"
                                        selectedKeys={getSelectedKeys(
                                            formik.values.status as string
                                        )}
                                        onSelectionChange={(keys) => {
                                            // Convert Set to CSV string
                                            formik.setFieldValue(
                                                'status',
                                                Array.from(keys).join(',')
                                            )
                                        }}
                                    >
                                        {options.statuses.map((s) => (
                                            <SelectItem
                                                key={s.value}
                                                textValue={s.label}
                                            >
                                                <div className="flex gap-2 items-center">
                                                    <div className="w-2 h-2 rounded-full bg-default-400" />
                                                    {s.label}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </Select>
                                </div>

                                {/* --- Assignee --- */}
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between items-end">
                                        <span className="text-small font-medium text-default-700">
                                            Assignee
                                        </span>
                                        <LogicToggle
                                            value={
                                                formik.values.assigneeOperator
                                            }
                                            onChange={(val) =>
                                                formik.setFieldValue(
                                                    'assigneeOperator',
                                                    val
                                                )
                                            }
                                            isVisible={!!formik.values.assignee}
                                        />
                                    </div>
                                    <Select
                                        name="assignee"
                                        selectionMode="multiple"
                                        placeholder="Select staff"
                                        variant="bordered"
                                        selectedKeys={getSelectedKeys(
                                            formik.values.assignee as string
                                        )}
                                        onSelectionChange={(keys) =>
                                            formik.setFieldValue(
                                                'assignee',
                                                Array.from(keys).join(',')
                                            )
                                        }
                                    >
                                        {options.assignees.map((a) => (
                                            <SelectItem key={a.value}>
                                                {a.label}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                </div>

                                {/* --- Accordions --- */}
                                <Accordion
                                    selectionMode="multiple"
                                    variant="splitted"
                                    className="px-0"
                                    itemClasses={{
                                        base: 'group-[.is-splitted]:px-0 group-[.is-splitted]:shadow-none group-[.is-splitted]:bg-transparent',
                                        trigger:
                                            'py-2 px-1 data-[hover=true]:bg-default-100 rounded-lg',
                                        content: 'pb-4 px-1',
                                    }}
                                >
                                    <AccordionItem
                                        key="details"
                                        title={
                                            <span className="text-small font-medium text-default-600">
                                                Job Details
                                            </span>
                                        }
                                    >
                                        <div className="flex flex-col gap-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex justify-between">
                                                    <span className="text-tiny text-default-500">
                                                        Job Type
                                                    </span>
                                                    <LogicToggle
                                                        value={
                                                            formik.values
                                                                .typeOperator
                                                        }
                                                        onChange={(val) =>
                                                            formik.setFieldValue(
                                                                'typeOperator',
                                                                val
                                                            )
                                                        }
                                                        isVisible={
                                                            !!formik.values.type
                                                        }
                                                    />
                                                </div>
                                                <Select
                                                    name="type"
                                                    selectionMode="multiple"
                                                    placeholder="Any Type"
                                                    variant="bordered"
                                                    size="sm"
                                                    selectedKeys={getSelectedKeys(
                                                        formik.values
                                                            .type as string
                                                    )}
                                                    onSelectionChange={(keys) =>
                                                        formik.setFieldValue(
                                                            'type',
                                                            Array.from(
                                                                keys
                                                            ).join(',')
                                                        )
                                                    }
                                                >
                                                    {options.types.map((t) => (
                                                        <SelectItem
                                                            key={t.value}
                                                        >
                                                            {t.label}
                                                        </SelectItem>
                                                    ))}
                                                </Select>
                                            </div>
                                            <Select
                                                name="paymentChannel"
                                                label="Payment Channel"
                                                labelPlacement="outside"
                                                selectionMode="multiple"
                                                placeholder="Any Channel"
                                                variant="bordered"
                                                size="sm"
                                                selectedKeys={getSelectedKeys(
                                                    formik.values
                                                        .paymentChannel as string
                                                )}
                                                onSelectionChange={(keys) =>
                                                    formik.setFieldValue(
                                                        'paymentChannel',
                                                        Array.from(keys).join(
                                                            ','
                                                        )
                                                    )
                                                }
                                            >
                                                {options.paymentChannels.map(
                                                    (p) => (
                                                        <SelectItem
                                                            key={p.value}
                                                        >
                                                            {p.label}
                                                        </SelectItem>
                                                    )
                                                )}
                                            </Select>
                                        </div>
                                    </AccordionItem>

                                    <AccordionItem
                                        key="timeline"
                                        title={
                                            <span className="text-small font-medium text-default-600">
                                                Timeline
                                            </span>
                                        }
                                    >
                                        <div className="flex flex-col gap-4">
                                            <DateRangePicker
                                                label="Created Date"
                                                variant="bordered"
                                                size="sm"
                                                onChange={(val) =>
                                                    handleDateChange(
                                                        val,
                                                        'createdAt'
                                                    )
                                                }
                                            />
                                            <DateRangePicker
                                                label="Due Date"
                                                variant="bordered"
                                                size="sm"
                                                onChange={(val) =>
                                                    handleDateChange(
                                                        val,
                                                        'dueAt'
                                                    )
                                                }
                                            />
                                            <DateRangePicker
                                                label="Finished Date"
                                                variant="bordered"
                                                size="sm"
                                                onChange={(val) =>
                                                    handleDateChange(
                                                        val,
                                                        'finishedAt'
                                                    )
                                                }
                                            />
                                        </div>
                                    </AccordionItem>

                                    <AccordionItem
                                        key="financials"
                                        title={
                                            <span className="text-small font-medium text-default-600">
                                                Financials
                                            </span>
                                        }
                                        subtitle={
                                            <span className="text-tiny text-default-400">
                                                Income & Staff costs
                                            </span>
                                        }
                                    >
                                        <div className="flex flex-col gap-5">
                                            {/* --- Income Cost Range --- */}
                                            <div className="flex flex-col gap-1.5">
                                                <span className="text-tiny font-semibold text-default-500">
                                                    Income Range
                                                </span>
                                                <div className="flex items-start gap-2">
                                                    <Input
                                                        name="incomeCostMin"
                                                        placeholder="Min"
                                                        startContent={
                                                            <span className="text-default-400 text-tiny">
                                                                $
                                                            </span>
                                                        }
                                                        variant="bordered"
                                                        size="sm"
                                                        value={
                                                            formik.values
                                                                .incomeCostMin ||
                                                            ''
                                                        }
                                                        onChange={
                                                            formik.handleChange
                                                        }
                                                        isInvalid={
                                                            !!formik.errors
                                                                .incomeCostMin
                                                        }
                                                        errorMessage={
                                                            formik.errors
                                                                .incomeCostMin as string
                                                        }
                                                    />
                                                    <span className="text-default-300 mt-2">
                                                        —
                                                    </span>
                                                    <Input
                                                        name="incomeCostMax"
                                                        placeholder="Max"
                                                        startContent={
                                                            <span className="text-default-400 text-tiny">
                                                                $
                                                            </span>
                                                        }
                                                        variant="bordered"
                                                        size="sm"
                                                        value={
                                                            formik.values
                                                                .incomeCostMax ||
                                                            ''
                                                        }
                                                        onChange={
                                                            formik.handleChange
                                                        }
                                                        isInvalid={
                                                            !!formik.errors
                                                                .incomeCostMax
                                                        }
                                                        errorMessage={
                                                            formik.errors
                                                                .incomeCostMax as string
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            {/* --- Staff Cost Range (New) --- */}
                                            <div className="flex flex-col gap-1.5">
                                                <span className="text-tiny font-semibold text-default-500">
                                                    Staff Cost Range
                                                </span>
                                                <div className="flex items-start gap-2">
                                                    <Input
                                                        name="staffCostMin"
                                                        placeholder="Min"
                                                        startContent={
                                                            <span className="text-default-400 text-tiny">
                                                                $
                                                            </span>
                                                        }
                                                        variant="bordered"
                                                        size="sm"
                                                        value={
                                                            formik.values
                                                                .staffCostMin ||
                                                            ''
                                                        }
                                                        onChange={
                                                            formik.handleChange
                                                        }
                                                        isInvalid={
                                                            !!formik.errors
                                                                .staffCostMin
                                                        }
                                                        errorMessage={
                                                            formik.errors
                                                                .staffCostMin as string
                                                        }
                                                    />
                                                    <span className="text-default-300 mt-2">
                                                        —
                                                    </span>
                                                    <Input
                                                        name="staffCostMax"
                                                        placeholder="Max"
                                                        startContent={
                                                            <span className="text-default-400 text-tiny">
                                                                $
                                                            </span>
                                                        }
                                                        variant="bordered"
                                                        size="sm"
                                                        value={
                                                            formik.values
                                                                .staffCostMax ||
                                                            ''
                                                        }
                                                        onChange={
                                                            formik.handleChange
                                                        }
                                                        isInvalid={
                                                            !!formik.errors
                                                                .staffCostMax
                                                        }
                                                        errorMessage={
                                                            formik.errors
                                                                .staffCostMax as string
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </AccordionItem>
                                </Accordion>
                            </form>
                        </DrawerBody>

                        <DrawerFooter className="border-t border-default-200/50 pt-4">
                            <Button
                                color="danger"
                                variant="light"
                                onPress={() => formik.resetForm()}
                            >
                                Reset
                            </Button>
                            <Button
                                color="primary"
                                className="font-semibold"
                                onPress={() => formik.handleSubmit()}
                            >
                                Apply Filters
                            </Button>
                        </DrawerFooter>
                    </>
                )}
            </DrawerContent>
        </Drawer>
    )
}

const SearchIcon = () => (
    <svg
        aria-hidden="true"
        fill="none"
        focusable="false"
        height="1em"
        role="presentation"
        viewBox="0 0 24 24"
        width="1em"
        className="text-default-400 pointer-events-none flex-shrink-0"
    >
        <path
            d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
        />
        <path
            d="M22 22L20 20"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
        />
    </svg>
)
