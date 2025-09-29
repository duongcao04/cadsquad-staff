import { Pagination, PaginationProps, Select, SelectItem } from '@heroui/react'
import React from 'react'

const limitValues = [
    { key: '10', label: '10' },
    { key: '15', label: '15' },
    { key: '20', label: '20' },
    { key: '25', label: '25' },
]

type Props = {
    paginationProps: PaginationProps
    limitItems?: {
        limitValue?: string
        onChange?: (key: string) => void
    }
}
export default function PaginationPanel({
    paginationProps,
    limitItems = {
        limitValue: '10',
    },
}: Props) {
    return (
        <div className="size-full flex items-center justify-between">
            <Pagination color="primary" {...paginationProps} showControls />
            <div className="min-w-[450px] h-full flex items-center justify-end gap-3">
                <p className="text-sm text-text2">Showing 1 - 10 of 50</p>
                <div className="h-5 w-[1px] bg-text3" />
                <div className="flex items-center justify-end gap-2">
                    <p className="text-sm text-nowrap">Listings per Page</p>
                    <Select
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
