import React from 'react'

import {
    Button,
    Chip,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownSection,
    DropdownTrigger,
} from '@heroui/react'
import { CheckCheck, CircleX, EllipsisVerticalIcon, Trash } from 'lucide-react'
import { mutate } from 'swr'

import { updateJobStatus } from '@/lib/swr/actions/jobStatus'
import { PROJECT_API } from '@/lib/swr/api'
import { JobStatus, Project } from '@/validationSchemas/project.schema'

import { useNextJobStatus } from '../utils/useNextJobStatus'

type Props = {
    setDeleteProject: React.Dispatch<React.SetStateAction<Project | null>>
    onOpen: () => void
    data: Project
}

export default function ActionDropdown({
    data,
    setDeleteProject,
    onOpen,
}: Props) {
    const { nextStatuses, hasMultipleOptions } = useNextJobStatus(
        data.jobStatus.order!
    )

    const handleSwitch = async (project: Project, nextJobStatus: JobStatus) => {
        try {
            const data = await mutate(
                PROJECT_API,
                updateJobStatus(project, nextJobStatus)
            )
            console.log(data)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Dropdown>
            <DropdownTrigger>
                <Button isIconOnly variant="light" size="sm">
                    <EllipsisVerticalIcon size={16} />
                </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Project menu actions">
                <DropdownSection showDivider title={'Workflow'}>
                    {hasMultipleOptions ? (
                        <>
                            <DropdownItem
                                key="multi-approved"
                                startContent={<CheckCheck size={16} />}
                                onPress={() =>
                                    handleSwitch(data, nextStatuses.approved!)
                                }
                            >
                                Approved to
                                <Chip
                                    style={{
                                        backgroundColor:
                                            nextStatuses.approved?.color,
                                        marginLeft: '5px',
                                    }}
                                >
                                    {nextStatuses.approved?.title}
                                </Chip>
                            </DropdownItem>
                            <DropdownItem
                                key="multi-disapproved"
                                startContent={<CircleX size={16} />}
                                onPress={() =>
                                    handleSwitch(
                                        data,
                                        nextStatuses.disapproved!
                                    )
                                }
                            >
                                Disapproved to
                                <Chip
                                    style={{
                                        backgroundColor:
                                            nextStatuses.disapproved?.color,
                                        marginLeft: '5px',
                                    }}
                                >
                                    {nextStatuses.disapproved?.title}
                                </Chip>
                            </DropdownItem>
                        </>
                    ) : (
                        <DropdownItem
                            key="disapproved"
                            startContent={<CheckCheck size={16} />}
                            onPress={() =>
                                handleSwitch(data, nextStatuses.approved!)
                            }
                        >
                            Approved to
                            <Chip
                                style={{
                                    backgroundColor:
                                        nextStatuses.approved?.color,
                                    marginLeft: '5px',
                                }}
                            >
                                {nextStatuses.approved?.title}
                            </Chip>
                        </DropdownItem>
                    )}
                </DropdownSection>
                <DropdownSection>
                    <DropdownItem
                        key="delete"
                        startContent={<Trash size={16} />}
                        onClick={() => {
                            onOpen()
                            setDeleteProject(data)
                        }}
                        color="danger"
                    >
                        Delete
                    </DropdownItem>
                </DropdownSection>
            </DropdownMenu>
        </Dropdown>
    )
}
