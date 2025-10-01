'use client'

import React from 'react'
import { useJobTypeDetail, useJobTypes } from '@/shared/queries/useJobType'
import {
    HeroSelect,
    HeroSelectItem,
} from '@/shared/components/customize/HeroSelect'
import { FormikProps } from 'formik'
import { CreateJobInput } from '@/shared/validationSchemas/job.schema'
import { Slash } from 'lucide-react'
import { Skeleton } from '@heroui/react'
import lodash from 'lodash'

type Props = {
    formik: FormikProps<CreateJobInput>
}

export default function InsertJobNo({ formik }: Props) {
    const { data: jobTypes, isLoading: isLoadingJobTypes } = useJobTypes()
    const { jobType, isLoading: isLoadingJobType } = useJobTypeDetail(
        formik.values.typeId
    )

    return (
        <div className="grid grid-cols-[140px_1fr] gap-3 items-center">
            <p className="relative text-right font-medium text-base pr-2">
                No.
                <span className="absolute top-0 right-0 text-danger!">*</span>
            </p>

            <div className="grid grid-cols-[0.75fr_24px_1fr] items-center gap-4">
                <HeroSelect
                    isLoading={isLoadingJobTypes}
                    isRequired
                    label="Job type"
                    placeholder="Select type manage"
                    size="sm"
                    selectedKeys={[formik.values.typeId]}
                    onChange={(e) => {
                        const value = e.target.value
                        const jobNo =
                            (jobType?.code && jobType.code) +
                            '.' +
                            lodash.padStart(
                                String(
                                    jobType?._count?.['jobs'] !== undefined
                                        ? jobType._count['jobs'] + 1
                                        : 1
                                ),
                                4,
                                '0'
                            )
                        formik.setFieldValue('typeId', value)
                        formik.setFieldValue('no', jobNo)
                        formik.setFieldTouched('typeId', true, false)
                    }}
                >
                    {jobTypes?.map((jType) => (
                        <HeroSelectItem key={jType.id}>
                            {jType.displayName}
                        </HeroSelectItem>
                    ))}
                </HeroSelect>

                <Slash className="rotate-[-20deg] text-text2" />

                {formik.values.typeId ? (
                    <Skeleton
                        className="w-fit h-fit rounded-md"
                        isLoaded={!isLoadingJobType}
                    >
                        <p className="font-medium text-2xl tracking-wider">
                            {jobType?.code}.
                            {lodash.padStart(
                                String(
                                    jobType?._count?.['jobs'] !== undefined
                                        ? jobType._count['jobs'] + 1
                                        : 1
                                ),
                                4,
                                '0'
                            )}
                        </p>
                    </Skeleton>
                ) : (
                    <p className="text-lg text-text2">
                        Vui lòng chọn phân loại dự án
                    </p>
                )}
            </div>
        </div>
    )
}
