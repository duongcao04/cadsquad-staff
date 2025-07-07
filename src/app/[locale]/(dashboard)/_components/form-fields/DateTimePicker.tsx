import React from 'react'

import { ClearOutlined } from '@ant-design/icons'
import { Button, DatePicker, TimeRangePickerProps } from 'antd'
import { RangePickerProps } from 'antd/es/date-picker'
import dayjs, { type Dayjs } from 'dayjs'
import { FormikProps } from 'formik'

import { NewProject } from '@/validationSchemas/project.schema'

const { RangePicker } = DatePicker

const dateFormat = 'YYYY/MM/DD'

type Props = {
    form: FormikProps<NewProject>
}

export default function DateTimePicker({ form }: Props) {
    const defaultValues: RangePickerProps['defaultValue'] = [
        form.values.startedAt.length === 0
            ? null
            : dayjs(form.values.startedAt.replaceAll('/', '-'), dateFormat),
        form.values.dueAt.length === 0
            ? null
            : dayjs(form.values.dueAt.replaceAll('/', '-'), dateFormat),
    ]

    const onRangeChange = (
        dates: null | (Dayjs | null)[],
        dateStrings: string[]
    ) => {
        if (dates) {
            form.setFieldValue('startedAt', dateStrings[0])
            form.setFieldValue('dueAt', dateStrings[1])
        } else {
            form.setFieldValue('startedAt', '')
            form.setFieldValue('dueAt', '')
        }
    }

    const rangePresets: TimeRangePickerProps['presets'] = [
        { label: 'Next 7 Days', value: [dayjs(), dayjs().add(7, 'd')] },
        { label: 'Next 14 Days', value: [dayjs(), dayjs().add(14, 'd')] },
        { label: 'Next 30 Days', value: [dayjs(), dayjs().add(30, 'd')] },
        { label: 'Next 90 Days', value: [dayjs(), dayjs().add(90, 'd')] },
    ]

    const resetRange = () => {
        form.setFieldValue('startedAt', '')
        form.setFieldValue('dueAt', '')
    }

    return (
        <RangePicker
            size="large"
            placement="topRight"
            renderExtraFooter={() => {
                return (
                    <div className="py-2 flex items-center justify-between gap-3">
                        <div></div>
                        <Button icon={<ClearOutlined />} onClick={resetRange}>
                            Today
                        </Button>
                        <Button icon={<ClearOutlined />} onClick={resetRange}>
                            Clear
                        </Button>
                    </div>
                )
            }}
            allowClear={{
                clearIcon: <ClearOutlined onClick={resetRange} />,
            }}
            format={dateFormat}
            value={defaultValues}
            presets={rangePresets}
            onChange={onRangeChange}
        />
    )
}
