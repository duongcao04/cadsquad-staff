import { jobsPendingDeliverOptions, useDeliverJobMutation } from '@/lib/queries'
import {
    DeliverJobInputSchema,
    TDeliverJobInput,
} from '@/lib/validationSchemas/_job.schema'
import {
    Button,
    Chip,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Select,
    SelectItem,
    Textarea,
} from '@heroui/react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useFormik } from 'formik' // Import useFormik
import {
    CheckCircle2,
    Link as LinkIcon,
    Paperclip,
    Send,
    X,
} from 'lucide-react'
import { JobStatusChip } from '../chips/JobStatusChip'
import lodash from 'lodash'

interface DeliverJobModalProps {
    isOpen: boolean
    defaultJob?: string
    onClose: () => void
    onConfirm?: (data: TDeliverJobInput) => void
}

export const DeliverJobModal = ({
    defaultJob,
    isOpen,
    onClose,
    onConfirm,
}: DeliverJobModalProps) => {
    const deliverJobMutation = useDeliverJobMutation()

    // 1. Setup Formik
    const formik = useFormik<TDeliverJobInput>({
        initialValues: {
            jobId: defaultJob ?? '',
            note: '',
            link: '',
            files: [],
        },
        validationSchema: DeliverJobInputSchema,
        enableReinitialize: true,
        onSubmit: (values) => {
            console.log(values)
            // Override submit action
            if (onConfirm) {
                onConfirm(values)
                onClose()
                formik.resetForm()
            } else {
                deliverJobMutation.mutateAsync(
                    {
                        jobId: values.jobId,
                        data: {
                            files: values.files,
                            link: lodash.isEmpty(values.link)
                                ? undefined
                                : values.link,
                            note: lodash.isEmpty(values.note)
                                ? undefined
                                : values.note,
                        },
                    },
                    {
                        onSuccess() {
                            onClose()
                            formik.resetForm()
                        },
                    }
                )
            }
        },
    })

    const { data: pendingDeliverJobs } = useSuspenseQuery({
        ...jobsPendingDeliverOptions(),
    })

    // Helper to reset form on close
    const handleClose = () => {
        formik.resetForm()
        onClose()
    }

    // Helper for file uploads
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            // Mock: Convert File -> URL string. In real app, upload here.
            const newFiles = Array.from(e.target.files).map((f) =>
                URL.createObjectURL(f)
            )
            formik.setFieldValue('files', [
                ...(formik.values.files || []),
                ...newFiles,
            ])
        }
    }

    const removeFile = (index: number) => {
        const newFiles = (formik.values.files || []).filter(
            (_, i) => i !== index
        )
        formik.setFieldValue('files', newFiles)
    }

    return (
        <Modal isOpen={isOpen} onClose={handleClose} backdrop="blur" size="lg">
            <ModalContent>
                {() => (
                    <form onSubmit={formik.handleSubmit}>
                        <ModalHeader className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-primary">
                                <Send size={20} />
                                <span className="text-lg font-bold">
                                    Deliver Job
                                </span>
                            </div>
                            <p className="text-xs text-text-subdued font-normal">
                                This will change status to{' '}
                                <strong>DELIVERED</strong> and notify the
                                manager for review.
                            </p>
                        </ModalHeader>

                        <ModalBody className="py-4 space-y-4">
                            {pendingDeliverJobs &&
                            pendingDeliverJobs.length > 0 ? (
                                <>
                                    {/* JOB SELECT */}
                                    <Select
                                        label="Select Job"
                                        placeholder="Which job is for delivery?"
                                        labelPlacement="outside"
                                        variant="bordered"
                                        name="jobId"
                                        // Handle Selection manually for HeroUI
                                        selectedKeys={
                                            formik.values.jobId
                                                ? [formik.values.jobId]
                                                : []
                                        }
                                        defaultSelectedKeys={
                                            formik.values.jobId
                                                ? [formik.values.jobId]
                                                : []
                                        }
                                        isDisabled={!lodash.isEmpty(defaultJob)}
                                        onChange={(e) => {
                                            formik.handleChange(e) // Standard change
                                        }}
                                        // Validation Props
                                        isInvalid={
                                            !!(
                                                formik.touched.jobId &&
                                                formik.errors.jobId
                                            )
                                        }
                                        errorMessage={
                                            formik.touched.jobId &&
                                            formik.errors.jobId
                                        }
                                        onBlur={formik.handleBlur}
                                    >
                                        {pendingDeliverJobs.map((job) => (
                                            <SelectItem
                                                key={job.id}
                                                textValue={job.displayName}
                                            >
                                                <div className="flex items-center justify-between gap-2">
                                                    <div>
                                                        <p className="text-xs text-text-subdued">
                                                            #{job.no}
                                                        </p>
                                                        <p className="text-text-sm font-semibold">
                                                            {job.displayName}
                                                        </p>
                                                    </div>
                                                    <JobStatusChip
                                                        data={job.status}
                                                        props={{ size: 'sm' }}
                                                    />
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </Select>

                                    {/* NOTE TEXTAREA */}
                                    <Textarea
                                        label="Delivery Note"
                                        placeholder="Describe what you are delivering..."
                                        variant="bordered"
                                        labelPlacement="outside"
                                        minRows={3}
                                        name="note"
                                        value={formik.values.note}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        isInvalid={
                                            !!(
                                                formik.touched.note &&
                                                formik.errors.note
                                            )
                                        }
                                        errorMessage={
                                            formik.touched.note &&
                                            formik.errors.note
                                        }
                                    />

                                    {/* LINK INPUT */}
                                    <Input
                                        label="External Link (Optional)"
                                        placeholder="https://figma.com/..."
                                        variant="bordered"
                                        labelPlacement="outside"
                                        startContent={
                                            <LinkIcon
                                                size={16}
                                                className="text-default-400"
                                            />
                                        }
                                        name="link"
                                        value={formik.values.link || ''}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        isInvalid={
                                            !!(
                                                formik.touched.link &&
                                                formik.errors.link
                                            )
                                        }
                                        errorMessage={
                                            formik.touched.link &&
                                            formik.errors.link
                                        }
                                    />

                                    {/* FILE UPLOAD & LIST */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">
                                                Attachments
                                            </span>
                                            <label className="cursor-pointer text-xs text-primary hover:underline flex items-center gap-1">
                                                <Paperclip size={14} />
                                                Add Files
                                                <input
                                                    type="file"
                                                    multiple
                                                    className="hidden"
                                                    onChange={handleFileChange}
                                                />
                                            </label>
                                        </div>

                                        {formik.values.files &&
                                            formik.values.files.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {formik.values.files.map(
                                                        (_, index) => (
                                                            <Chip
                                                                key={index}
                                                                onClose={() =>
                                                                    removeFile(
                                                                        index
                                                                    )
                                                                }
                                                                variant="flat"
                                                                color="primary"
                                                                size="sm"
                                                                endContent={
                                                                    <X
                                                                        size={
                                                                            12
                                                                        }
                                                                    />
                                                                }
                                                            >
                                                                File {index + 1}
                                                            </Chip>
                                                        )
                                                    )}
                                                </div>
                                            )}
                                    </div>

                                    {/* CHECKLIST UI */}
                                    <div className="bg-default-50 p-3 rounded-lg border border-default-200 flex gap-3 items-start">
                                        <CheckCircle2
                                            size={18}
                                            className="text-default-500 mt-0.5"
                                        />
                                        <div className="text-xs text-default-600 tracking-wide">
                                            <strong>Checklist:</strong>
                                            <ul className="list-disc pl-4 mt-1 space-y-1">
                                                <li>All assets uploaded?</li>
                                                <li>
                                                    Code pushed to correct
                                                    branch?
                                                </li>
                                                <li>
                                                    Client requirements met?
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <p className="text-center text-default-500 py-4">
                                    You have no pending deliver jobs
                                </p>
                            )}
                        </ModalBody>

                        <ModalFooter>
                            {pendingDeliverJobs &&
                            pendingDeliverJobs.length > 0 ? (
                                <>
                                    <Button
                                        variant="light"
                                        onPress={handleClose}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        color="primary"
                                        variant="solid"
                                        type="submit"
                                        isLoading={deliverJobMutation.isPending}
                                        startContent={
                                            !deliverJobMutation.isPending && (
                                                <Paperclip size={18} />
                                            )
                                        }
                                    >
                                        Submit Delivery
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    color="primary"
                                    variant="solid"
                                    onPress={handleClose}
                                >
                                    Close
                                </Button>
                            )}
                        </ModalFooter>
                    </form>
                )}
            </ModalContent>
        </Modal>
    )
}
