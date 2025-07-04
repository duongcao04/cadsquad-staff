import React from 'react'

import { Button, Input } from '@heroui/react'
import { Modal } from 'antd'
import { useFormik } from 'formik'

import {
    CreateProjectSchema,
    NewProject,
} from '@/validationSchemas/project.schema'

type Props = {
    isOpen: boolean
    onClose: () => void
}
export default function JobModal({ isOpen, onClose }: Props) {
    const formik = useFormik<NewProject>({
        initialValues: {
            jobName: '',
            dueAt: '',
            jobNo: '',
            price: '',
            sourceUrl: '',
            startedAt: '',
        },
        validationSchema: CreateProjectSchema,
        onSubmit: (values) => {
            console.log(values)
        },
    })
    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            title="Create new Job"
            width={{
                xs: '90%',
                sm: '80%',
                md: '70%',
                lg: '60%',
                xl: '50%',
                xxl: '40%',
            }}
            footer={() => {
                return (
                    <div>
                        <Button>OK</Button>
                    </div>
                )
            }}
        >
            <form onSubmit={formik.handleSubmit} className="space-y-5">
                <Input
                    isRequired
                    id="jobNo"
                    name="jobNo"
                    label="Job No."
                    value={formik.values.jobNo}
                    onChange={formik.handleChange}
                    isInvalid={
                        Boolean(formik.touched.jobNo) &&
                        Boolean(formik.errors.jobNo)
                    }
                    errorMessage={
                        Boolean(formik.touched.jobNo) && formik.errors.jobNo
                    }
                    size="sm"
                />
                <Input
                    isRequired
                    id="jobName"
                    name="jobName"
                    label="Job Name"
                    value={formik.values.jobName}
                    onChange={formik.handleChange}
                    isInvalid={
                        Boolean(formik.touched.jobName) &&
                        Boolean(formik.errors.jobName)
                    }
                    errorMessage={
                        Boolean(formik.touched.jobName) && formik.errors.jobName
                    }
                    size="sm"
                />
                <Input
                    isRequired
                    id="sourceUrl"
                    name="sourceUrl"
                    label="Link"
                    value={formik.values.sourceUrl}
                    onChange={formik.handleChange}
                    isInvalid={
                        Boolean(formik.touched.sourceUrl) &&
                        Boolean(formik.errors.sourceUrl)
                    }
                    errorMessage={
                        Boolean(formik.touched.sourceUrl) &&
                        formik.errors.sourceUrl
                    }
                    size="sm"
                />
            </form>
        </Modal>
    )
}
