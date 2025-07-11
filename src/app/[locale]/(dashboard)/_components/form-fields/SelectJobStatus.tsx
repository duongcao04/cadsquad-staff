'use client'

import React, { useEffect, useState } from 'react'

import { Select } from 'antd'
import { FormikProps } from 'formik'

import type { JobStatus, NewProject } from '@/validationSchemas/project.schema'

type Props = {
    form: FormikProps<NewProject>
}
export default function SelectJobStatus({ form }: Props) {
    const [jobStatuses, setJobStatuses] = useState<JobStatus[]>([])
    const [isLoading, setLoading] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const res = await fetch('/api/jobStatus', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                })
                const { data } = await res.json()
                setJobStatuses(data)

                form.setFieldValue('jobStatusId', data[0].id)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    return (
        <Select
            loading={isLoading}
            options={jobStatuses.map((jsts) => {
                return { ...jsts, label: jsts.title!, value: jsts.id! }
            })}
            placeholder="Job status"
            size="large"
            optionRender={(opt) => {
                return <p className="font-normal">{opt.data.title}</p>
            }}
            styles={{}}
            onChange={(value) => {
                form.setFieldValue('jobStatusId', value)
            }}
            value={form.values.jobStatusId}
        />
    )
}
