'use client'

import React, { useState } from 'react'

import {
    Avatar,
    AvatarGroup,
    Button,
    Chip,
    Spinner,
    Tooltip,
} from '@heroui/react'
import { Drawer, Skeleton } from 'antd'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import {
    Banknote,
    CalendarClock,
    CalendarPlus,
    ChevronUp,
    CircleDollarSign,
    FolderIcon,
    HandCoins,
    Link as LinkIcon,
    Loader,
    Users,
} from 'lucide-react'
import Link from 'next/link'
import useSWR from 'swr'

import { formatCurrencyVND } from '@/lib/formatCurrency'
import { getProjectByJobNo } from '@/lib/swr/actions/project'
import { PROJECT_API } from '@/lib/swr/api'

import DetailTabs from './_components/DetailTabs'
import { useDetailModal } from './actions'

dayjs.extend(utc)
dayjs.extend(timezone)

const DATE_FORMAT = 'DD/MM/YYYY'

export default function ProjectDetailDrawer() {
    const { closeModal, detailId } = useDetailModal()
    const isOpen = detailId === null ? false : true

    const [showFullAssignee, setShowFullAssignee] = useState(false)

    const { data: project, isLoading } = useSWR(
        [`${PROJECT_API}/?jobNo=${detailId}`],
        () => getProjectByJobNo(detailId)
    )

    return (
        <Drawer
            open={isOpen}
            title={
                isLoading ? (
                    <Skeleton paragraph={{ rows: 1 }} />
                ) : (
                    <div className="flex items-center justify-start gap-2">
                        <p className="max-w-[70%] line-clamp-1">
                            {project?.jobNo}
                        </p>
                        <p>/</p>
                        <Chip
                            style={{
                                backgroundColor: project?.jobStatus?.color,
                            }}
                            classNames={{
                                base: 'block max-w-full flex items-center justify-start',
                                content:
                                    'block w-full uppercase text-sm font-semibold tracking-wide text-center',
                            }}
                            size="sm"
                        >
                            {project?.jobStatus?.title}
                        </Chip>
                    </div>
                )
            }
            width={600}
            classNames={{
                mask: 'backdrop-blur-sm',
            }}
            onClose={closeModal}
        >
            {isLoading && <Spinner />}
            {!isLoading && (
                <>
                    <p className="text-2xl font-semibold text-wrap">
                        {project?.jobName}
                    </p>
                    <div className="mt-7 space-y-4 text-base">
                        <div className="grid grid-cols-[0.5fr_1fr]">
                            <div className="flex items-center justify-start gap-2 opacity-80">
                                <Loader size={16} />
                                <p className="font-normal line-clamp-1">
                                    Status
                                </p>
                            </div>
                            <p className="font-semibold">
                                {project?.jobStatus?.title}
                            </p>
                        </div>
                        <div className="grid grid-cols-[0.5fr_1fr]">
                            <div className="flex items-center justify-start gap-2 opacity-80">
                                <CalendarPlus size={16} />
                                <p className="font-normal line-clamp-1">
                                    Started at
                                </p>
                            </div>
                            <p className="font-semibold">
                                {dayjs
                                    .utc(project?.startedAt)
                                    .tz('Asia/Ho_Chi_Minh')
                                    .format(DATE_FORMAT)}
                            </p>
                        </div>
                        <div className="grid grid-cols-[0.5fr_1fr]">
                            <div className="flex items-center justify-start gap-2 opacity-80">
                                <CalendarClock size={16} />
                                <p className="font-normal line-clamp-1">
                                    Due to
                                </p>
                            </div>
                            <p className="font-semibold">
                                {dayjs
                                    .utc(project?.dueAt)
                                    .tz('Asia/Ho_Chi_Minh')
                                    .format(DATE_FORMAT)}
                            </p>
                        </div>
                        <div
                            className={`grid grid-cols-[0.5fr_1fr] ${showFullAssignee && 'pt-1 items-start'}`}
                        >
                            <div className="flex items-center justify-start gap-2 opacity-80">
                                <Users size={16} />
                                <p className="font-normal line-clamp-1">
                                    Assignee
                                </p>
                            </div>
                            <div className="w-full">
                                {!showFullAssignee ? (
                                    <AvatarGroup
                                        size="sm"
                                        max={5}
                                        total={
                                            project?.memberAssign &&
                                            project?.memberAssign.length - 5
                                        }
                                        isBordered
                                        classNames={{
                                            base: 'cursor-pointer',
                                        }}
                                        onClick={() =>
                                            setShowFullAssignee(true)
                                        }
                                    >
                                        {project?.memberAssign?.map((mem) => {
                                            return (
                                                <Tooltip
                                                    key={mem.id}
                                                    content={mem?.name}
                                                    classNames={{
                                                        content:
                                                            'max-w-fit text-nowrap',
                                                    }}
                                                >
                                                    <Avatar
                                                        src={mem?.avatar ?? ''}
                                                        classNames={{
                                                            base: 'data-[hover=true]:-translate-x-0 rtl:data-[hover=true]:translate-x-0 cursor-pointer',
                                                        }}
                                                        showFallback
                                                    />
                                                </Tooltip>
                                            )
                                        })}
                                    </AvatarGroup>
                                ) : (
                                    <div className="grid grid-cols-[1fr_32px] gap-4">
                                        <div className="flex items-center justify-start flex-wrap gap-x-3 gap-y-4">
                                            {project?.memberAssign?.map(
                                                (mem) => {
                                                    return (
                                                        <div
                                                            key={mem.id}
                                                            className="flex items-center justify-start gap-3 bg bg-border p-1 rounded-3xl pr-4"
                                                        >
                                                            <Avatar
                                                                size="sm"
                                                                src={
                                                                    mem.avatar!
                                                                }
                                                                classNames={{
                                                                    img: 'opacity-100',
                                                                }}
                                                                isBordered
                                                                showFallback
                                                            />
                                                            <p className="text-sm">
                                                                {mem.name}
                                                            </p>
                                                        </div>
                                                    )
                                                }
                                            )}
                                        </div>
                                        <Tooltip
                                            content="Hidden"
                                            color="primary"
                                        >
                                            <Button
                                                isIconOnly
                                                size="sm"
                                                variant="light"
                                                onPress={() =>
                                                    setShowFullAssignee(false)
                                                }
                                            >
                                                <ChevronUp />
                                            </Button>
                                        </Tooltip>
                                    </div>
                                )}
                            </div>
                        </div>
                        <hr className="opacity-10" />
                        <div className="grid grid-cols-[0.5fr_1fr]">
                            <div className="flex items-center justify-start gap-2 opacity-80">
                                <Banknote size={18} />
                                <p className="font-normal line-clamp-1">
                                    Payment Channel
                                </p>
                            </div>
                            <p className="font-semibold">ACB</p>
                        </div>
                        <div className="grid grid-cols-[0.5fr_1fr]">
                            <div className="flex items-center justify-start gap-2 opacity-80">
                                <CircleDollarSign size={16} />
                                <p className="font-normal line-clamp-1">
                                    Income
                                </p>
                            </div>
                            <p className="font-semibold">
                                {formatCurrencyVND(20, 'en-US', 'USD')}
                            </p>
                        </div>
                        <div className="grid grid-cols-[0.5fr_1fr]">
                            <div className="flex items-center justify-start gap-2 opacity-80">
                                <HandCoins size={16} />
                                <p className="font-normal line-clamp-1">
                                    Staff Cost
                                </p>
                            </div>
                            <p className="font-semibold text-lg text-danger">
                                {formatCurrencyVND(500000, 'vi-VN', 'VND')}
                            </p>
                        </div>
                        <hr className="opacity-10" />
                        <div className="space-y-3">
                            <div className="flex items-center justify-start gap-2 opacity-80">
                                <LinkIcon size={16} />
                                <p className="font-normal line-clamp-1">
                                    Sharepoint Link (1)
                                </p>
                            </div>
                            <Link
                                href={project?.sourceUrl ?? '#'}
                                target="_blank"
                                className="border border-border w-fit px-3 py-2 rounded-lg grid grid-cols-[30px_1fr] gap-4 items-center max-w-[40%]"
                            >
                                <FolderIcon size={30} strokeWidth={1.4} />
                                <div>
                                    <p className="text-sm font-medium line-clamp-1">
                                        {project?.jobNo} - {project?.jobName}
                                    </p>
                                </div>
                            </Link>
                        </div>
                        <div className="mt-4">
                            <DetailTabs />
                        </div>
                    </div>
                </>
            )}
        </Drawer>
    )
}
