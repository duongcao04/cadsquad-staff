'use client'
import { darkenHexColor, lightenHexColor, PAID_STATUS_COLOR } from '@/lib/utils'
import { Job } from '@/shared/interfaces'
import { Button, Popover, PopoverContent, PopoverTrigger } from '@heroui/react'
import { PaidChip } from '../chips'
import { useTheme } from 'next-themes'
import { ChevronDown } from 'lucide-react'

type Props = {
    jobData: Job
}
export default function PaymentStatusDropdown({ jobData }: Props) {
    const { resolvedTheme } = useTheme()

    const getBackgroundColor = (statusTitle: 'paid' | 'unpaid') => {
        return resolvedTheme === 'light'
            ? lightenHexColor(
                  PAID_STATUS_COLOR[statusTitle]?.hexColor
                      ? PAID_STATUS_COLOR[statusTitle].hexColor
                      : '#ffffff',
                  90
              )
            : darkenHexColor(
                  PAID_STATUS_COLOR[statusTitle]?.hexColor
                      ? PAID_STATUS_COLOR[statusTitle].hexColor
                      : '#000000',
                  70
              )
    }

    const statusTitle = jobData.isPaid ? 'paid' : 'unpaid'

    const changeStatusTitle = !jobData.isPaid ? 'paid' : 'unpaid'

    return (
        <Popover
            placement="bottom-start"
            size="sm"
            classNames={{
                base: '!z-0',
                content: '!z-0 py-2 w-[300px]',
                backdrop: '!z-0',
                trigger: '!z-0',
            }}
            showArrow={true}
        >
            <PopoverTrigger className="opacity-100">
                <button className="cursor-pointer">
                    <PaidChip
                        status={statusTitle}
                        classNames={{
                            base: '!w-[100px]',
                            content: '!w-[100px] text-center',
                        }}
                        childrenRender={(paidStatus) => {
                            return (
                                <div className="flex items-center justify-between gap-2">
                                    <p>{paidStatus.title}</p>
                                    <ChevronDown size={14} />
                                </div>
                            )
                        }}
                    />
                </button>
            </PopoverTrigger>
            <PopoverContent aria-label="Change payment status action">
                <div className="size-full space-y-2.5">
                    <Button
                        className="w-full"
                        style={{
                            backgroundColor:
                                getBackgroundColor(changeStatusTitle),
                        }}
                    >
                        <div className="flex items-center justify-start gap-2">
                            <div
                                className="size-2 rounded-full"
                                style={{
                                    backgroundColor: PAID_STATUS_COLOR[
                                        changeStatusTitle
                                    ].hexColor
                                        ? PAID_STATUS_COLOR[changeStatusTitle]
                                              .hexColor
                                        : '#ffffff',
                                }}
                            />
                            <p
                                className="font-semibold"
                                style={{
                                    color: PAID_STATUS_COLOR[changeStatusTitle]
                                        .hexColor
                                        ? PAID_STATUS_COLOR[changeStatusTitle]
                                              .hexColor
                                        : '#ffffff',
                                }}
                            >
                                {PAID_STATUS_COLOR[changeStatusTitle].title}
                            </p>
                        </div>
                    </Button>
                </div>

                <p className="mt-2.5 border-t-1 border-text-muted pt-1.5 w-full text-center text-text-muted">
                    <span className="font-bold">#{jobData?.no}</span> / Update
                    payment status
                </p>
            </PopoverContent>
        </Popover>
    )
}
