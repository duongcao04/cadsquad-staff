'use client'

import React, { useState } from 'react'
import {
    DatePicker,
    RadioGroup,
    Radio,
    ButtonGroup,
    Button,
    cn,
    DateValue,
    RadioProps,
} from '@heroui/react'
import {
    startOfWeek,
    startOfMonth,
    getLocalTimeZone,
    today,
    CalendarDate,
} from '@internationalized/date'
import { useLocale } from '@react-aria/i18n'

type Props = {
    label: string
    defaultValue?: CalendarDate
    onChange?: (value: CalendarDate) => void
}
export function InsertDatePicker({
    label,
    defaultValue = today(getLocalTimeZone()),
    onChange,
}: Props) {
    const { locale } = useLocale()
    const [value, setValue] = useState<CalendarDate>(defaultValue)

    const now = today(getLocalTimeZone())
    const nextWeek = startOfWeek(now.add({ weeks: 1 }), locale)
    const nextMonth = startOfMonth(now.add({ months: 1 }))

    const handleChange = (value: CalendarDate) => {
        setValue(value)
        onChange?.(value)
    }

    const CustomRadio = (props: RadioProps) => {
        const { children, ...otherProps } = props

        return (
            <Radio
                {...otherProps}
                classNames={{
                    base: cn(
                        'flex-none m-0 h-8 bg-content1 hover:bg-content2 items-center justify-between',
                        'cursor-pointer rounded-full border-2 border-default-200/60',
                        'data-[selected=true]:border-primary'
                    ),
                    label: 'text-tiny text-default-500',
                    labelWrapper: 'px-1 m-0',
                    wrapper: 'hidden',
                }}
            >
                {children}
            </Radio>
        )
    }

    return (
        <div className="flex flex-col gap-4 w-full max-w-sm">
            <DatePicker
                CalendarBottomContent={
                    <RadioGroup
                        aria-label="Date precision"
                        classNames={{
                            base: 'w-full pb-2',
                            wrapper:
                                '-my-2.5 py-2.5 px-3 gap-1 flex-nowrap max-w-[380px] overflow-x-auto',
                        }}
                        defaultValue="exact_dates"
                        orientation="horizontal"
                    >
                        <CustomRadio value="exact_dates">
                            Exact dates
                        </CustomRadio>
                        <CustomRadio value="1_day">1 day</CustomRadio>
                        <CustomRadio value="1_month">1 month</CustomRadio>
                    </RadioGroup>
                }
                CalendarTopContent={
                    <ButtonGroup
                        fullWidth
                        className="px-3 pb-2 pt-3 bg-content1 [&>button]:text-default-500 [&>button]:border-default-200/60"
                        radius="full"
                        size="sm"
                        variant="bordered"
                    >
                        <Button onPress={() => handleChange(now)}>Today</Button>
                        <Button onPress={() => handleChange(nextWeek)}>
                            Next week
                        </Button>
                        <Button onPress={() => handleChange(nextMonth)}>
                            Next month
                        </Button>
                    </ButtonGroup>
                }
                calendarProps={{
                    focusedValue: value as unknown as DateValue,
                    onFocusChange(date) {
                        handleChange(date as unknown as CalendarDate)
                    },
                    nextButtonProps: {
                        variant: 'bordered',
                    },
                    prevButtonProps: {
                        variant: 'bordered',
                    },
                }}
                label={label}
                value={value as unknown as DateValue}
                onChange={(date) => {
                    handleChange(date as unknown as CalendarDate)
                }}
            />
        </div>
    )
}
