'use client'

import React, { useState } from 'react'

import { Button, Tooltip } from '@heroui/react'
import { Image, Table } from 'antd'
import type { TableColumnsType, TableProps } from 'antd'
import {
    ChevronDown,
    ChevronsLeftRight,
    EyeIcon,
    ListFilter,
    ListFilterPlus,
} from 'lucide-react'

import lodash from 'lodash'
import { VietnamDateFormat } from '@/lib/dayjs'
import { SortOrder } from 'antd/es/table/interface'
import { User } from '@/shared/interfaces/user.interface'

type DataType = User & {
    key: React.Key
}
type Props = {
    data: User[]
    isLoading?: boolean
    tableOptions?: TableProps<DataType>
}
export default function TeamTable({
    data: usersData,
    isLoading = false,
    tableOptions = { scroll: { x: 'max-content', y: 61 * 8 + 20 } },
}: Props) {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

    const dataColumns: TableColumnsType<DataType> = [
        {
            title: (
                <p className="w-[60px] truncate" title="Thumbnail">
                    Avatar
                </p>
            ),
            dataIndex: 'avatar',
            key: 'avatar',
            fixed: 'left',
            width: 60,
            render: (avatar) => {
                return (
                    <div className="flex items-center justify-center">
                        <div className="overflow-hidden rounded-full size-11">
                            <Image
                                src={avatar}
                                alt="image"
                                className="object-cover rounded-full size-full"
                                preview={false}
                            />
                        </div>
                    </div>
                )
            },
        },
        {
            title: 'Full name',
            dataIndex: 'displayName',
            key: 'displayName',
            minWidth: 120,
            render: (displayName, record: DataType) => (
                <div>
                    <p className="line-clamp-1">{displayName}</p>
                    <p className="text-xs line-clamp-1">{record.username}</p>
                </div>
            ),
            sorter: {
                compare: (a, b) => a.displayName!.localeCompare(b.displayName!),
                multiple: 4,
            },
            filters: lodash.uniqBy(usersData, 'displayName')?.map((item) => ({
                text: `${item.displayName}`,
                value: item?.displayName ?? '',
            })),
            onFilter: (value, record) =>
                record?.displayName?.indexOf(value as string) === 0,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            minWidth: 120,
            render: (email) => <p className="line-clamp-1">{email}</p>,
            sorter: {
                compare: (a, b) => a.email!.localeCompare(b.email!),
                multiple: 1,
            },
            filters: lodash.uniqBy(usersData, 'email')?.map((item) => ({
                text: item.email,
                value: item?.id ?? '',
            })),
            onFilter: (value, record) =>
                record.email.toString().indexOf(value as string) === 0,
        },
        {
            title: 'Phone number',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            minWidth: 120,
            render: (phoneNumber) => (
                <p className="line-clamp-1">{phoneNumber}</p>
            ),
        },
        {
            title: 'Department',
            dataIndex: 'department',
            key: 'department',
            minWidth: 120,
            render: (_, record: DataType) => (
                <p>{record.department?.displayName}</p>
            ),
        },
        {
            title: 'Job title',
            dataIndex: 'jobTitles',
            key: 'jobTitles',
            minWidth: 300,
            render: (_, record: DataType) => (
                <ul>
                    {record?.jobTitles?.map((jTitle) => {
                        return (
                            <li key={jTitle.id}>
                                <p>{jTitle.displayName}</p>
                            </li>
                        )
                    })}
                </ul>
            ),
            sorter: {
                compare: (a, b) => a.displayName.localeCompare(b.displayName),
                multiple: 3,
            },
        },
        {
            title: 'Active',
            dataIndex: 'isActive',
            key: 'isActive',
            minWidth: 130,
            render: (isActive) => <p>{isActive}</p>,
        },
        {
            title: 'Last logined',
            dataIndex: 'lastLoginAt',
            key: 'lastLoginAt',
            minWidth: 130,
            render: (lastLoginAt) => <p>{VietnamDateFormat(lastLoginAt)}</p>,
        },
        {
            title: 'Action',
            key: 'action',
            dataIndex: 'action',
            width: 150,
            fixed: 'right',
            render: () => {
                return (
                    <div className="flex items-center justify-end gap-2">
                        <Tooltip content="View detail">
                            <Button
                                variant="light"
                                color="primary"
                                className="flex items-center justify-center"
                                size="sm"
                                isIconOnly
                            >
                                <EyeIcon
                                    size={18}
                                    className="text-text-fore2"
                                />
                            </Button>
                        </Tooltip>
                    </div>
                )
            },
        },
    ]

    const dataSource = usersData?.map((usr, index) => ({
        ...usr,
        key: usr?.id ?? index,
    }))

    const finalColumns = dataColumns.map((item) => ({
        ...item,
        filterIcon: (filtered: boolean) => {
            return (
                <>
                    {!filtered ? (
                        <ListFilterPlus
                            size={14}
                            className="text-text2 transition duration-100"
                        />
                    ) : (
                        <ListFilter
                            size={14}
                            className="text-primary transition duration-100"
                        />
                    )}
                </>
            )
        },
        sortIcon: (props: { sortOrder: SortOrder }) => {
            const { sortOrder } = props
            return (
                <>
                    {sortOrder ? (
                        <ChevronDown
                            size={14}
                            className="transition duration-150 text-text2"
                            style={{
                                transform:
                                    sortOrder === 'ascend'
                                        ? 'rotate(0deg)'
                                        : 'rotate(180deg)',
                            }}
                        />
                    ) : (
                        <ChevronsLeftRight
                            size={14}
                            className="rotate-90 text-text2"
                        />
                    )}
                </>
            )
        },
    }))
    return (
        <Table<DataType>
            rowKey="username"
            columns={finalColumns}
            dataSource={dataSource}
            loading={isLoading}
            rowSelection={{
                selectedRowKeys,
                onChange: (newSelectedRowKeys: React.Key[]) =>
                    setSelectedRowKeys(newSelectedRowKeys),
            }}
            pagination={false}
            rowClassName="transition duration-500"
            scroll={tableOptions.scroll}
        />
    )
}
