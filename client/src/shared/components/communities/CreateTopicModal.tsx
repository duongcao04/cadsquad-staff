import React, { useState } from 'react'
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Textarea,
    Form,
} from '@heroui/react'

interface CreateTopicModalProps {
    isOpen: boolean
    onClose: () => void
    communityId?: string // Optional: if you need to pass the parent community ID
    onSubmit: (data: CreateTopicFormData) => Promise<void>
}

export interface CreateTopicFormData {
    title: string
    description: string
}

export const CreateTopicModal = ({
    isOpen,
    onClose,
    communityId,
    onSubmit,
}: CreateTopicModalProps) => {
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState<Partial<CreateTopicFormData>>({})

    // Form State
    const [formData, setFormData] = useState<CreateTopicFormData>({
        title: '',
        description: '',
    })

    const validate = () => {
        const newErrors: Partial<CreateTopicFormData> = {}
        if (!formData.title.trim()) newErrors.title = 'Topic title is required.'
        if (formData.title.length < 3)
            newErrors.title = 'Title must be at least 3 characters.'

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validate()) return

        try {
            setIsLoading(true)
            await onSubmit(formData)
            // Reset form on success
            setFormData({ title: '', description: '' })
            onClose()
        } catch (error) {
            console.error('Failed to create topic', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            placement="center"
            backdrop="blur"
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Create New Topic
                            {communityId && (
                                <span className="text-small font-normal text-default-500">
                                    for Community #{communityId}
                                </span>
                            )}
                        </ModalHeader>

                        <ModalBody>
                            <Form
                                className="flex flex-col gap-4"
                                onSubmit={handleSubmit}
                                id="create-topic-form"
                            >
                                <Input
                                    autoFocus
                                    label="Title"
                                    placeholder="e.g., General Discussion, Announcements"
                                    variant="bordered"
                                    value={formData.title}
                                    onValueChange={(val) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            title: val,
                                        }))
                                        if (errors.title)
                                            setErrors((prev) => ({
                                                ...prev,
                                                title: undefined,
                                            }))
                                    }}
                                    isInvalid={!!errors.title}
                                    errorMessage={errors.title}
                                    isRequired
                                />

                                <Textarea
                                    label="Description"
                                    placeholder="What is this topic about?"
                                    variant="bordered"
                                    minRows={3}
                                    value={formData.description}
                                    onValueChange={(val) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            description: val,
                                        }))
                                    }
                                />
                            </Form>
                        </ModalBody>

                        <ModalFooter>
                            <Button
                                color="danger"
                                variant="flat"
                                onPress={onClose}
                                isDisabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                color="primary"
                                type="submit"
                                form="create-topic-form"
                                isLoading={isLoading}
                            >
                                Create Topic
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}
