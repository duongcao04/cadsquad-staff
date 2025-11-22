'use client'

import { VietnamDateFormat } from '@/lib/dayjs'
import { CopyButton, handleCopy, UserActiveChip } from '@/shared/components'
import { DepartmentChip } from '@/shared/components/chips'
import { User } from '@/shared/interfaces'
import { UserColumn } from '@/shared/types/_user.type'
import { addToast, Button, Tooltip } from '@heroui/react'
import { Image, TableColumnsType } from 'antd'
import { SortOrder } from 'antd/es/table/interface'
import lodash from 'lodash'
import {
    ChevronDown,
    ChevronsLeftRight,
    ListFilter,
    ListFilterPlus,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { TableActionsDropdown } from '../components'

export type UserWithKey = User & {
    key: React.Key
}

type TableColumns<DataType> = Array<
    Omit<TableColumnsType<DataType>[number], 'dataIndex'> & {
        dataIndex: UserColumn
    }
>

export function userColumns(
    data: {
        users: User[]
    },
    options: {
        locale?: string
        showColumns?: string[]
        translations: ReturnType<typeof useTranslations>
    }
): TableColumns<UserWithKey> {
    const { users } = data
    const { showColumns, translations } = options

    const allColumns: TableColumns<UserWithKey> = [
        {
            title: translations('userColumns.displayName'),
            dataIndex: 'displayName',
            key: 'displayName',
            fixed: 'left',
            minWidth: 320,
            render: (_: unknown, record: UserWithKey) => (
                <div className="flex items-center justify-start gap-2.5">
                    <Image
                        src={String(record.avatar)}
                        alt={record.displayName}
                        rootClassName="rounded-full size-10"
                        className="object-cover rounded-full size-full"
                        preview={false}
                    />
                    <div>
                        <p className="line-clamp-1 font-semibold">
                            {record.displayName}
                        </p>
                        <button
                            className="size-full flex items-center justify-start link w-fit"
                            title={translations('copy')}
                            onClick={() =>
                                handleCopy(record.username, () => {
                                    addToast({
                                        title: translations(
                                            'copiedToClipboard'
                                        ),
                                        color: 'success',
                                    })
                                })
                            }
                        >
                            <p className="line-clamp-1 text-text-muted text-xs">
                                @{record.username}
                            </p>
                        </button>
                    </div>
                </div>
            ),
            sorter: {
                compare: (a: UserWithKey, b: UserWithKey) =>
                    a.displayName!.localeCompare(b.displayName!),
                multiple: 4,
            },
            filters: lodash.uniqBy(users, 'displayName')?.map((item) => ({
                text: `${item.displayName}`,
                value: item?.displayName ?? '',
            })),
            onFilter: (value, record) =>
                record?.displayName?.indexOf(value as string) === 0,
        },
        {
            title: translations('userColumns.email'),
            dataIndex: 'email',
            key: 'email',
            minWidth: 280,
            render: (_: unknown, record: UserWithKey) => (
                <button
                    className="size-full flex items-center justify-start link w-fit"
                    title={translations('copyEmail')}
                    onClick={() =>
                        handleCopy(record.email, () => {
                            addToast({
                                title: translations('copiedToClipboard'),
                                color: 'success',
                            })
                        })
                    }
                >
                    <p className="line-clamp-1">{record.email}</p>
                </button>
            ),
            sorter: {
                compare: (a, b) => a.email!.localeCompare(b.email!),
                multiple: 1,
            },
            filters: lodash.uniqBy(users, 'email')?.map((item) => ({
                text: item.email,
                value: item?.email ?? '',
            })),
            onFilter: (value, record) =>
                record.email.toString().indexOf(value as string) === 0,
        },
        {
            title: (
                <p
                    className="truncate"
                    title={translations('userColumns.phoneNumber')}
                >
                    {translations('userColumns.phoneNumber')}
                </p>
            ),
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            minWidth: 180,
            render: (phoneNumber) => (
                <>
                    {phoneNumber ? (
                        <button
                            className="size-full flex items-center justify-start link w-fit"
                            title="Copy contact phone number"
                            onClick={() => {
                                {
                                    navigator.clipboard
                                        .writeText(phoneNumber)
                                        .then(() => {
                                            addToast({
                                                title: 'Copy contact phone number successful',
                                                color: 'success',
                                            })
                                        })
                                        .catch((err) => {
                                            console.log(err)
                                            addToast({
                                                title: 'Copy contact phone number fail',
                                                color: 'danger',
                                            })
                                        })
                                }
                            }}
                        >
                            <p className="line-clamp-1">{phoneNumber}</p>
                        </button>
                    ) : (
                        <p>-</p>
                    )}
                </>
            ),
            sorter: {
                compare: (a, b) => a.phoneNumber!.localeCompare(b.phoneNumber!),
                multiple: 1,
            },
        },
        {
            title: (
                <p
                    className="truncate"
                    title={translations('userColumns.department')}
                >
                    {translations('userColumns.department')}
                </p>
            ),
            dataIndex: 'department',
            key: 'department',
            minWidth: 200,
            render: (_, record: UserWithKey) => (
                <div className="w-full">
                    {record.department ? (
                        <DepartmentChip data={record.department} />
                    ) : (
                        <p className="link !text-text-muted">Add department</p>
                    )}
                </div>
            ),
            sorter: {
                compare: (a, b) =>
                    String(a.department?.displayName).localeCompare(
                        String(b.department?.displayName)
                    ),
                multiple: 3,
            },
        },
        {
            title: (
                <p
                    className="truncate"
                    title={translations('userColumns.jobTitle')}
                >
                    {translations('userColumns.jobTitle')}
                </p>
            ),
            dataIndex: 'jobTitle',
            key: 'jobTitle',
            minWidth: 200,
            render: (_, record: UserWithKey) => (
                <div>
                    {record.jobTitle ? (
                        <p className="line-clamp-1">
                            {record.jobTitle?.displayName}
                        </p>
                    ) : (
                        <p className="link !text-text-muted">Add job title</p>
                    )}
                </div>
            ),
            sorter: {
                compare: (a, b) =>
                    String(a.jobTitle?.displayName).localeCompare(
                        String(b.jobTitle?.displayName)
                    ),
                multiple: 2,
            },
        },
        {
            title: (
                <p
                    className="truncate"
                    title={translations('userColumns.isActive')}
                >
                    {translations('userColumns.isActive')}
                </p>
            ),
            dataIndex: 'isActive',
            key: 'isActive',
            minWidth: 130,
            render: (isActive) => (
                <UserActiveChip
                    status={isActive ? 'activated' : 'unActivated'}
                />
            ),
        },
        {
            title: (
                <p
                    className="truncate"
                    title={translations('userColumns.lastLoginAt')}
                >
                    {translations('userColumns.lastLoginAt')}
                </p>
            ),
            dataIndex: 'lastLoginAt',
            key: 'lastLoginAt',
            width: 160,
            render: (_, record: UserWithKey) => (
                <p className="line-clamp-1">
                    {record?.lastLoginAt ? (
                        VietnamDateFormat(record.lastLoginAt, {
                            format: 'LT - L',
                        })
                    ) : (
                        <p>-</p>
                    )}
                </p>
            ),
        },
        {
            title: (
                <p
                    className="truncate"
                    title={translations('userColumns.createdAt')}
                >
                    {translations('userColumns.createdAt')}
                </p>
            ),
            dataIndex: 'createdAt',
            key: 'createdAt',
            minWidth: 160,
            render: (_, record: UserWithKey) => (
                <div>
                    {record?.createdAt && VietnamDateFormat(record.createdAt)}
                </div>
            ),
        },
        {
            title: (
                <p
                    className="truncate"
                    title={translations('userColumns.updatedAt')}
                >
                    {translations('userColumns.updatedAt')}
                </p>
            ),
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            minWidth: 160,
            render: (_, record: UserWithKey) => (
                <div>
                    {record?.updatedAt && VietnamDateFormat(record.updatedAt)}
                </div>
            ),
        },
        {
            title: (
                <p
                    className="truncate"
                    title={translations('userColumns.action')}
                >
                    {translations('userColumns.action')}
                </p>
            ),
            key: 'action',
            dataIndex: 'action',
            width: 150,
            fixed: 'right',
            render: (_, record: UserWithKey) => {
                return (
                    <div className="flex items-center justify-end gap-2">
                        <Tooltip content={translations('copyEmail')}>
                            <Button
                                variant="light"
                                color="primary"
                                className="flex items-center justify-center"
                                size="sm"
                                isIconOnly
                                disableRipple
                            >
                                <CopyButton
                                    slot="p"
                                    content={record.email}
                                    variant="ghost"
                                />
                            </Button>
                        </Tooltip>
                        <TableActionsDropdown data={record} />
                    </div>
                )
            },
        },
    ]
    if (showColumns && showColumns.length > 0) {
        return allColumns.map((item) => ({
            ...item,
            hidden: !showColumns?.includes(item.key as UserColumn),
            filterIcon: (filtered: boolean) => {
                return (
                    <>
                        {!filtered ? (
                            <ListFilterPlus
                                size={14}
                                className="text-text-muted transition duration-100"
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
                                className="transition duration-150 text-text-muted"
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
                                className="rotate-90 text-text-muted"
                            />
                        )}
                    </>
                )
            },
        }))
    }
    return allColumns
}
