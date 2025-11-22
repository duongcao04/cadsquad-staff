'use client'

import { Avatar, DatePicker, Drawer, Image } from 'antd'
import React from 'react'

import {
    useJobStatuses,
    useJobTypes,
    usePaymentChannels,
    useUpdateConfigByCodeMutation,
    useUsers,
} from '@/lib/queries'
import { HeroSelect, HeroSelectItem } from '@/shared/components'
import { JobColumn } from '@/shared/types'
import { Button, Slider, Spinner } from '@heroui/react'
import {
    ArrowLeft,
    Handshake,
    Landmark,
    Layers2,
    Loader,
    UsersRound,
} from 'lucide-react'
import { useTranslations } from 'next-intl'

export const PaymentStatuses = [
    {
        title: 'Paid',
        hexColor: '#2a9174',
    },
    {
        title: 'Unpaid',
        hexColor: '#f83640',
    },
]

export type THeaderColumns = {
    title: string
    key: JobColumn
    icon?: React.ReactNode
}[]
type Props = { isOpen: boolean; onClose: () => void }

export function FilterDrawer({ isOpen, onClose }: Props) {
    const t = useTranslations()

    const { data: jobStatuses, isLoading: loadingJobStatuses } =
        useJobStatuses()
    const { data: paymentChannels, isLoading: loadingPaymentChannels } =
        usePaymentChannels()
    const { data: jobTypes, isLoading: loadingJobTypes } = useJobTypes()
    const { users, isLoading: loadingUsers } = useUsers()
    useUpdateConfigByCodeMutation()

    return (
        <Drawer
            open={isOpen}
            title={<p>{t('filter')}</p>}
            width={500}
            maskClosable
            closeIcon={<ArrowLeft size={16} className="!text-text-default" />}
            mask={true}
            onClose={onClose}
            // classNames={{
            //     body: '!py-3 !px-5',
            // }}
            footer={
                <div className="flex items-center justify-between gap-3">
                    <Button
                        variant="light"
                        className="!w-full"
                        onPress={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="solid"
                        color="primary"
                        className="!w-full"
                        onPress={() => {
                            alert('Tính năng đang được phát triển')
                        }}
                    >
                        Apply
                    </Button>
                </div>
            }
            styles={{
                body: {
                    padding: 0,
                },
            }}
        >
            <div className="relative size-full">
                {false && (
                    <div className="absolute bg-background opacity-50 size-full z-20 flex items-center justify-center">
                        <Spinner size="lg" className="!opacity-100" />
                    </div>
                )}
                <div className="pb-10">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <p className="font-medium text-base">Date range</p>
                        </div>
                        <div className="mt-2 space-y-2">
                            <div className="flex items-center justify-between">
                                <p className="font-medium text-text-default">
                                    Create at
                                </p>
                                <div>
                                    <button className="link cursor-pointer hover:underline underline-offset-2 transition duration-150">
                                        <p className="font-medium text-text-subdued">
                                            Reset
                                        </p>
                                    </button>
                                </div>
                            </div>
                            <DatePicker.RangePicker
                                placeholder={['Start Date', 'Till Now']}
                                rootClassName="w-full"
                                allowEmpty={[false, true]}
                                onChange={(date, dateString) => {
                                    console.log(date, dateString)
                                }}
                            />
                        </div>
                        <div className="mt-2 space-y-2">
                            <div className="flex items-center justify-between">
                                <p className="font-medium text-text-default">
                                    Due at
                                </p>
                                <div>
                                    <button className="link cursor-pointer hover:underline underline-offset-2 transition duration-150">
                                        <p className="font-medium text-text-subdued">
                                            Reset
                                        </p>
                                    </button>
                                </div>
                            </div>
                            <DatePicker.RangePicker
                                placeholder={['Start Date', 'Till Now']}
                                rootClassName="w-full"
                                allowEmpty={[false, true]}
                                onChange={(date, dateString) => {
                                    console.log(date, dateString)
                                }}
                            />
                        </div>
                        <div className="mt-2 space-y-2">
                            <div className="flex items-center justify-between">
                                <p className="font-medium text-text-default">
                                    Completed at
                                </p>
                                <div>
                                    <button className="link cursor-pointer hover:underline underline-offset-2 transition duration-150">
                                        <p className="font-medium text-text-subdued">
                                            Reset
                                        </p>
                                    </button>
                                </div>
                            </div>
                            <DatePicker.RangePicker
                                placeholder={['Start Date', 'Till Now']}
                                rootClassName="w-full"
                                allowEmpty={[false, true]}
                                onChange={(date, dateString) => {
                                    console.log(date, dateString)
                                }}
                            />
                        </div>
                    </div>
                    <hr className="mt-6 mb-4 w-full text-text-disabled" />
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <p className="font-medium text-base">Cost range</p>
                        </div>
                        <div className="mt-2 space-y-2">
                            <div className="flex items-center justify-between">
                                <p className="font-medium text-text-default">
                                    Income cost
                                </p>
                                <div>
                                    <button className="link cursor-pointer hover:underline underline-offset-2 transition duration-150">
                                        <p className="font-medium text-text-subdued">
                                            Reset
                                        </p>
                                    </button>
                                </div>
                            </div>
                            <Slider
                                defaultValue={[100, 500]}
                                formatOptions={{
                                    style: 'currency',
                                    currency: 'USD',
                                }}
                                maxValue={1000}
                                minValue={0}
                                step={50}
                                showTooltip
                            />
                        </div>
                        <div className="mt-2 space-y-2">
                            <div className="flex items-center justify-between">
                                <p className="font-medium text-text-default">
                                    Staff cost
                                </p>
                                <div>
                                    <button className="link cursor-pointer hover:underline underline-offset-2 transition duration-150">
                                        <p className="font-medium text-text-subdued">
                                            Reset
                                        </p>
                                    </button>
                                </div>
                            </div>
                            <Slider
                                defaultValue={[100, 500]}
                                formatOptions={{
                                    style: 'currency',
                                    currency: 'VND',
                                }}
                                maxValue={1000}
                                minValue={0}
                                step={50}
                                showTooltip
                            />
                        </div>
                    </div>
                    <hr className="mt-6 mb-4 w-full text-text-disabled" />
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center justify-start gap-1.5">
                                <Loader
                                    size={14}
                                    className="text-text-default"
                                />
                                <p className="font-medium text-base">
                                    {t('jobColumns.status')}
                                </p>
                            </div>
                            <div>
                                <button className="link cursor-pointer hover:underline underline-offset-2 transition duration-150">
                                    <p className="font-medium text-text-subdued">
                                        Reset
                                    </p>
                                </button>
                            </div>
                        </div>
                        <div>
                            <HeroSelect
                                isLoading={loadingJobStatuses}
                                id="status"
                                name="status"
                                placeholder="Select one or more status"
                                selectionMode="multiple"
                                size="lg"
                                onChange={() => {
                                    // const value = e.target.value
                                    // formik.setFieldValue('departmentId', value)
                                    // formik.setFieldTouched(
                                    //     'departmentId',
                                    //     true,
                                    //     false
                                    // )
                                }}
                                variant="bordered"
                                renderValue={(selectedItems) => {
                                    return (
                                        <ul className="flex line-clamp-1 truncate">
                                            {selectedItems.map((jobStatus) => {
                                                const item = jobStatuses?.find(
                                                    (d) =>
                                                        d.id === jobStatus.key
                                                )
                                                if (!item)
                                                    return (
                                                        <span
                                                            className="text-gray-400"
                                                            key={jobStatus.key}
                                                        >
                                                            Select one job
                                                            status
                                                        </span>
                                                    )
                                                return (
                                                    <p key={jobStatus.key}>
                                                        {item.displayName}
                                                        {item.id !==
                                                            selectedItems[
                                                                selectedItems.length -
                                                                    1
                                                            ].key && (
                                                            <span className="pr-1">
                                                                ,
                                                            </span>
                                                        )}
                                                    </p>
                                                )
                                            })}
                                        </ul>
                                    )
                                }}
                            >
                                {jobStatuses?.map((jobStatus) => (
                                    <HeroSelectItem key={jobStatus.id}>
                                        <div className="flex items-center justify-start gap-2">
                                            <div
                                                className="size-2 rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        jobStatus.hexColor
                                                            ? jobStatus.hexColor
                                                            : 'transparent',
                                                }}
                                            />
                                            <p>{jobStatus.displayName}</p>
                                        </div>
                                    </HeroSelectItem>
                                ))}
                            </HeroSelect>
                        </div>
                    </div>
                    <hr className="mt-6 mb-4 w-full text-text-disabled" />
                    <div className="space-y-3">
                        <div className="flex items-center justify-start gap-1.5">
                            <Landmark size={14} className="text-text-default" />
                            <p className="font-medium text-base">Payment</p>
                        </div>
                        <div className="mt-2 space-y-2">
                            <div className="flex items-center justify-between">
                                <p className="font-medium text-text-default">
                                    {t('jobColumns.paymentChannel')}
                                </p>
                                <div>
                                    <button className="link cursor-pointer hover:underline underline-offset-2 transition duration-150">
                                        <p className="font-medium text-text-subdued">
                                            Reset
                                        </p>
                                    </button>
                                </div>
                            </div>
                            <HeroSelect
                                isLoading={loadingPaymentChannels}
                                id="payment channel"
                                name="payment channel"
                                placeholder="Select one or more payment channel"
                                selectionMode="multiple"
                                variant="bordered"
                                size="lg"
                                onChange={() => {
                                    // const value = e.target.value
                                    // formik.setFieldValue('departmentId', value)
                                    // formik.setFieldTouched(
                                    //     'departmentId',
                                    //     true,
                                    //     false
                                    // )
                                }}
                                renderValue={(selectedItems) => {
                                    return (
                                        <ul className="flex line-clamp-1 truncate">
                                            {selectedItems.map(
                                                (paymentChannel) => {
                                                    const item =
                                                        paymentChannels?.find(
                                                            (d) =>
                                                                d.id ===
                                                                paymentChannel.key
                                                        )
                                                    if (!item)
                                                        return (
                                                            <span
                                                                className="text-gray-400"
                                                                key={
                                                                    paymentChannel.key
                                                                }
                                                            >
                                                                Select one
                                                                department
                                                            </span>
                                                        )
                                                    return (
                                                        <p
                                                            key={
                                                                paymentChannel.key
                                                            }
                                                        >
                                                            {item.displayName}
                                                            {item.id !==
                                                                selectedItems[
                                                                    selectedItems.length -
                                                                        1
                                                                ].key && (
                                                                <span className="pr-1">
                                                                    ,
                                                                </span>
                                                            )}
                                                        </p>
                                                    )
                                                }
                                            )}
                                        </ul>
                                    )
                                }}
                            >
                                {paymentChannels?.map((paymentChannel) => (
                                    <HeroSelectItem key={paymentChannel.id}>
                                        <div className="flex items-center justify-start gap-2">
                                            <div
                                                className="size-2 rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        paymentChannel.hexColor
                                                            ? paymentChannel.hexColor
                                                            : 'transparent',
                                                }}
                                            />
                                            <p>{paymentChannel.displayName}</p>
                                        </div>
                                    </HeroSelectItem>
                                ))}
                            </HeroSelect>
                        </div>
                        <div className="mt-2 space-y-2">
                            <div className="flex items-center justify-between">
                                <p className="font-medium text-text-default">
                                    Status
                                </p>
                                <div>
                                    <button className="link cursor-pointer hover:underline underline-offset-2 transition duration-150">
                                        <p className="font-medium text-text-subdued">
                                            Reset
                                        </p>
                                    </button>
                                </div>
                            </div>
                            <HeroSelect
                                id="paymentStatus"
                                name="paymentStatus"
                                placeholder="Select payment status"
                                variant="bordered"
                                size="lg"
                                onChange={() => {
                                    // const value = e.target.value
                                    // formik.setFieldValue('departmentId', value)
                                    // formik.setFieldTouched(
                                    //     'departmentId',
                                    //     true,
                                    //     false
                                    // )
                                }}
                                renderValue={(selectedItems) => {
                                    const item = PaymentStatuses?.find(
                                        (d) => d.title === selectedItems[0].key
                                    )
                                    if (!item)
                                        return (
                                            <span className="text-gray-400">
                                                Select payment status
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
                                {PaymentStatuses?.map((pStatus) => (
                                    <HeroSelectItem key={pStatus.title}>
                                        <div className="flex items-center justify-start gap-2">
                                            <div
                                                className="size-2 rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        pStatus.hexColor
                                                            ? pStatus.hexColor
                                                            : 'transparent',
                                                }}
                                            />
                                            <p>{pStatus.title}</p>
                                        </div>
                                    </HeroSelectItem>
                                ))}
                            </HeroSelect>
                        </div>
                    </div>
                    <hr className="mt-6 mb-4 w-full text-text-disabled" />
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center justify-start gap-1.5">
                                <UsersRound
                                    size={14}
                                    className="text-text-default"
                                />
                                <p className="font-medium text-base">
                                    {t('jobColumns.assignee')}
                                </p>
                            </div>
                            <div>
                                <button className="link cursor-pointer hover:underline underline-offset-2 transition duration-150">
                                    <p className="font-medium text-text-subdued">
                                        Reset
                                    </p>
                                </button>
                            </div>
                        </div>
                        <HeroSelect
                            isLoading={loadingUsers}
                            id="assignee"
                            name="assignee"
                            placeholder="Select one or more assignee"
                            size="lg"
                            selectionMode="multiple"
                            variant="bordered"
                            onChange={() => {
                                // const value = e.target.value
                                // const valueArr = value
                                //     .split(',')
                                //     .filter((i) => i !== '')
                                // formik.setFieldValue('userIds', valueArr)
                                // formik.setFieldTouched('userIds', true, false)
                            }}
                            classNames={{
                                base: 'overflow-hidden',
                            }}
                            renderValue={(selectedItems) => {
                                return (
                                    <div className="flex line-clamp-1 truncate gap-1.5">
                                        <Avatar.Group
                                            max={{
                                                count: 18,
                                                style: {
                                                    color: '#f56a00',
                                                    backgroundColor: '#fde3cf',
                                                },
                                            }}
                                        >
                                            {selectedItems.map((user) => {
                                                const item = users?.find(
                                                    (d) => d.id === user.key
                                                )

                                                const departmentColor =
                                                    item?.department
                                                        ? item?.department
                                                              ?.hexColor
                                                        : 'transparent'
                                                if (!item)
                                                    return (
                                                        <span
                                                            className="text-gray-400"
                                                            key={user.key}
                                                        >
                                                            Select one assignee
                                                        </span>
                                                    )
                                                return (
                                                    <Avatar
                                                        src={
                                                            item.avatar as string
                                                        }
                                                        key={user.key}
                                                        rootClassName="!border-2"
                                                        style={{
                                                            borderColor:
                                                                departmentColor,
                                                        }}
                                                    />
                                                )
                                            })}
                                        </Avatar.Group>
                                    </div>
                                )
                            }}
                        >
                            {users?.map((usr) => {
                                const departmentColor = usr.department
                                    ? usr.department?.hexColor
                                    : 'transparent'
                                return (
                                    <HeroSelectItem key={usr.id}>
                                        <div className="flex items-center justify-start gap-4">
                                            <div className="size-9">
                                                <Image
                                                    src={usr.avatar as string}
                                                    alt="user avatar"
                                                    rootClassName="!size-10 rounded-full"
                                                    className="!size-full rounded-full p-[1px] border-2 object-cover"
                                                    preview={false}
                                                    style={{
                                                        borderColor:
                                                            departmentColor,
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
                                )
                            })}
                        </HeroSelect>
                    </div>
                    <hr className="mt-6 mb-4 w-full text-text-disabled" />
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center justify-start gap-1.5">
                                <Layers2
                                    size={14}
                                    className="text-text-default"
                                />
                                <p className="font-medium text-base">
                                    {t('jobColumns.type')}
                                </p>
                            </div>
                            <div>
                                <button className="link cursor-pointer hover:underline underline-offset-2 transition duration-150">
                                    <p className="font-medium text-text-subdued">
                                        Reset
                                    </p>
                                </button>
                            </div>
                        </div>
                        <div>
                            <HeroSelect
                                isLoading={loadingJobTypes}
                                id="jobTypes"
                                name="jobTypes"
                                placeholder="Select one or more type"
                                selectionMode="multiple"
                                variant="bordered"
                                size="lg"
                                onChange={() => {
                                    // const value = e.target.value
                                    // formik.setFieldValue('departmentId', value)
                                    // formik.setFieldTouched(
                                    //     'departmentId',
                                    //     true,
                                    //     false
                                    // )
                                }}
                                renderValue={(selectedItems) => {
                                    return (
                                        <ul className="flex line-clamp-1 truncate">
                                            {selectedItems.map((jobType) => {
                                                const item = jobTypes?.find(
                                                    (d) => d.id === jobType.key
                                                )
                                                if (!item)
                                                    return (
                                                        <span
                                                            className="text-gray-400"
                                                            key={jobType.key}
                                                        >
                                                            Select one job type
                                                        </span>
                                                    )
                                                return (
                                                    <p key={jobType.key}>
                                                        {item.displayName}
                                                        {item.id !==
                                                            selectedItems[
                                                                selectedItems.length -
                                                                    1
                                                            ].key && (
                                                            <span className="pr-1">
                                                                ,
                                                            </span>
                                                        )}
                                                    </p>
                                                )
                                            })}
                                        </ul>
                                    )
                                }}
                            >
                                {jobTypes?.map((jobType) => (
                                    <HeroSelectItem key={jobType.id}>
                                        <div className="flex items-center justify-start gap-2">
                                            <div
                                                className="size-2 rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        jobType.hexColor
                                                            ? jobType.hexColor
                                                            : 'transparent',
                                                }}
                                            />
                                            <p>{jobType.displayName}</p>
                                        </div>
                                    </HeroSelectItem>
                                ))}
                            </HeroSelect>
                        </div>
                    </div>
                    <hr className="mt-6 mb-4 w-full text-text-disabled" />
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center justify-start gap-1.5">
                                <Handshake
                                    size={14}
                                    className="text-text-default"
                                />
                                <p className="font-medium text-base">
                                    {t('jobColumns.clientName')}
                                </p>
                            </div>
                            <div>
                                <button className="link cursor-pointer hover:underline underline-offset-2 transition duration-150">
                                    <p className="font-medium text-text-subdued">
                                        Reset
                                    </p>
                                </button>
                            </div>
                        </div>
                        <div>
                            <HeroSelect
                                isLoading={loadingJobStatuses}
                                id="status"
                                name="status"
                                placeholder="Select one or more status"
                                selectionMode="multiple"
                                variant="bordered"
                                size="lg"
                                onChange={() => {
                                    // const value = e.target.value
                                    // formik.setFieldValue('departmentId', value)
                                    // formik.setFieldTouched(
                                    //     'departmentId',
                                    //     true,
                                    //     false
                                    // )
                                }}
                                renderValue={(selectedItems) => {
                                    return (
                                        <ul className="flex line-clamp-1 truncate">
                                            {selectedItems.map((jobStatus) => {
                                                const item = jobStatuses?.find(
                                                    (d) =>
                                                        d.id === jobStatus.key
                                                )
                                                if (!item)
                                                    return (
                                                        <span
                                                            className="text-gray-400"
                                                            key={jobStatus.key}
                                                        >
                                                            Select one job
                                                            status
                                                        </span>
                                                    )
                                                return (
                                                    <p key={jobStatus.key}>
                                                        {item.displayName}
                                                        {item.id !==
                                                            selectedItems[
                                                                selectedItems.length -
                                                                    1
                                                            ].key && (
                                                            <span className="pr-1">
                                                                ,
                                                            </span>
                                                        )}
                                                    </p>
                                                )
                                            })}
                                        </ul>
                                    )
                                }}
                            >
                                {jobStatuses?.map((jobStatus) => (
                                    <HeroSelectItem key={jobStatus.id}>
                                        <div className="flex items-center justify-start gap-2">
                                            <div
                                                className="size-2 rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        jobStatus.hexColor
                                                            ? jobStatus.hexColor
                                                            : 'transparent',
                                                }}
                                            />
                                            <p>{jobStatus.displayName}</p>
                                        </div>
                                    </HeroSelectItem>
                                ))}
                            </HeroSelect>
                        </div>
                    </div>
                </div>
            </div>
        </Drawer>
    )
}
