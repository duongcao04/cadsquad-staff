'use client'

import { User } from '@/shared/interfaces'
import type { TableProps } from 'antd'
import { Table } from 'antd'
import { useLocale, useTranslations } from 'next-intl'
import React, { useState } from 'react'
import { userColumns } from '../columns'

type DataType = User & {
    key: React.Key
}
type Props = {
    data: User[]
    isLoading?: boolean
    tableOptions?: TableProps<DataType>
}
function TeamTable({
    data: usersData,
    isLoading = false,
    tableOptions = { scroll: { x: 'max-content', y: '100%' } },
}: Props) {
    const t = useTranslations()
    const locale = useLocale()
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

    const dataSource = usersData?.map((usr, index) => ({
        ...usr,
        key: usr?.id ?? index,
    }))
    const columns = userColumns(
        {
            users: usersData,
        },
        {
            locale,
            translations: t,
        }
    )

    return (
        <Table<DataType>
            rowKey="username"
            columns={columns}
            dataSource={dataSource}
            loading={isLoading}
            rowSelection={{
                selectedRowKeys,
                onChange: (newSelectedRowKeys: React.Key[]) =>
                    setSelectedRowKeys(newSelectedRowKeys),
            }}
            pagination={false}
            size={'small'}
            rowClassName="size-full !bg-background transition duration-500"
            scroll={tableOptions.scroll}
        />
    )
}
export default React.memo(TeamTable)
