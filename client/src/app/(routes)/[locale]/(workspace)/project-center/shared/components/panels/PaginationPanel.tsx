'use client'

import { Paginate } from '@/shared/interfaces'
import {
    Pagination,
    PaginationProps,
    Select,
    SelectItem,
    Skeleton,
} from '@heroui/react'
import { useTranslations } from 'next-intl'
import React from 'react'

const limitValues = [
    { key: '10', label: '10' },
    { key: '15', label: '15' },
    { key: '20', label: '20' },
    { key: '25', label: '25' },
]

type Props = {
    paginate?: Paginate
    paginationProps: Omit<PaginationProps, 'total' | 'page'>
    onChangeItemsPerPage?: (key: string) => void
    isLoading?: boolean
}
function PaginationPanel({
    paginate = {
        limit: 10,
        page: 1,
        totalPages: 1,
        total: 1,
    },
    paginationProps,
    onChangeItemsPerPage,
    isLoading = false,
}: Props) {
    const t = useTranslations()
    const { page, limit, total, totalPages } = paginate
    const showingFrom = page * limit - limit + 1
    const showingTo = page * limit > total ? total : page * limit

    return (
        <div className="size-full flex items-center justify-between">
            <Pagination
                color="primary"
                {...paginationProps}
                showControls
                total={totalPages}
                page={page}
            />
            <div className="min-w-[450px] h-full flex items-center justify-end gap-3">
                <Skeleton
                    className="inline-block w-fit h-fit rounded-md"
                    isLoaded={!isLoading}
                >
                    <p className="text-sm text-text2">
                        {t('paginationShowing', {
                            from: showingFrom,
                            to: showingTo,
                            total: total,
                        })}
                    </p>
                </Skeleton>
                <div className="h-5 w-[1px] bg-text3" />
                <div className="flex items-center justify-end gap-2">
                    <p className="text-sm text-nowrap">
                        {t('listingsPerPage')}
                    </p>
                    <Select
                        aria-label={t('listingsPerPage')}
                        items={limitValues}
                        selectedKeys={
                            limit ? [`${limit}`] : [limitValues[0].key]
                        }
                        size="sm"
                        className="min-w-[70px]"
                        onSelectionChange={(keys) => {
                            onChangeItemsPerPage?.(String(keys.currentKey))
                        }}
                    >
                        {(value) => <SelectItem>{value.label}</SelectItem>}
                    </Select>
                </div>
            </div>
        </div>
    )
}
export default React.memo(PaginationPanel)
