import {
    Pagination,
    PaginationProps,
    Select,
    SelectItem,
    Skeleton,
} from '@heroui/react'
import React from 'react'

const limitValues = [
    { key: '10', label: '10' },
    { key: '15', label: '15' },
    { key: '20', label: '20' },
    { key: '25', label: '25' },
]

type Props = {
    paginationProps: { totalItems?: number } & PaginationProps
    limitItems?: {
        limitValue?: string
        onChange?: (key: string) => void
    }
    isLoading?: boolean
}
export default function PaginationPanel({
    paginationProps,
    limitItems = {
        limitValue: '10',
    },
    isLoading = false,
}: Props) {
    const { totalItems = 10, page = 1 } = paginationProps
    const showingFrom =
        page * parseInt(limitItems.limitValue ?? '') -
        parseInt(limitItems.limitValue ?? '') +
        1
    const showingTo =
        page * parseInt(limitItems.limitValue ?? '') > totalItems
            ? totalItems
            : page * parseInt(limitItems.limitValue ?? '')

    return (
        <div className="size-full flex items-center justify-between">
            <Pagination color="primary" {...paginationProps} showControls />
            <div className="min-w-[450px] h-full flex items-center justify-end gap-3">
                <Skeleton
                    className="inline-block w-fit h-fit rounded-md"
                    isLoaded={!isLoading}
                >
                    <p className="text-sm text-text2">
                        Showing {showingFrom} - {showingTo} of {totalItems}
                    </p>
                </Skeleton>
                <div className="h-5 w-[1px] bg-text3" />
                <div className="flex items-center justify-end gap-2">
                    <p className="text-sm text-nowrap">Listings per Page</p>
                    <Select
                        aria-label="Listings Per page"
                        items={limitValues}
                        selectedKeys={
                            limitItems.limitValue
                                ? [limitItems.limitValue]
                                : [limitValues[0].key]
                        }
                        size="sm"
                        className="min-w-[70px]"
                        onSelectionChange={(keys) => {
                            limitItems?.onChange?.(String(keys.currentKey))
                        }}
                    >
                        {(value) => <SelectItem>{value.label}</SelectItem>}
                    </Select>
                </div>
            </div>
        </div>
    )
}
