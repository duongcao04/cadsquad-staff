import {
    optimizeCloudinary,
    useAssignMemberMutation,
    useRemoveMemberMutation,
} from '@/lib'
import { usersListOptions } from '@/lib/queries'
import {
    Avatar,
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ScrollShadow,
    Spinner,
} from '@heroui/react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Plus, Search, Users, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { TUser } from '../../types'
import { HeroButton } from '../ui/hero-button'

interface AssignMembersModalProps {
    isOpen: boolean
    onClose: () => void
    jobId: string
    currentAssignees: TUser[]
}

export default function AssignMembersModal({
    isOpen,
    onClose,
    jobId,
    currentAssignees,
}: AssignMembersModalProps) {
    const {
        data: { users },
    } = useSuspenseQuery({
        ...usersListOptions(),
    })
    const [searchQuery, setSearchQuery] = useState('')

    // Local state to show updates instantly while API processes
    const [optimisticAssignees, setOptimisticAssignees] =
        useState(currentAssignees)

    const assignMutation = useAssignMemberMutation()
    const removeMutation = useRemoveMemberMutation()

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setOptimisticAssignees(currentAssignees)
            setSearchQuery('')
        }
    }, [isOpen, currentAssignees])

    // Filter Available Users
    const availableUsers = useMemo(() => {
        const assignedIds = new Set(optimisticAssignees.map((u) => u.id))
        return users.filter(
            (u) =>
                !assignedIds.has(u.id) &&
                u.displayName.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [optimisticAssignees, searchQuery])

    const handleAdd = (user: TUser) => {
        // 1. Optimistic Update
        setOptimisticAssignees([...optimisticAssignees, user])

        const prevMemberIds = currentAssignees.map((item) => item.id)
        // 2. API Call
        assignMutation.mutate({
            jobId,
            assignMemberInput: {
                prevMemberIds: JSON.stringify(prevMemberIds),
                updateMemberIds: JSON.stringify([...prevMemberIds, user.id]),
            },
        })
    }

    const handleRemove = (userId: string) => {
        // 1. Optimistic Update
        setOptimisticAssignees(
            optimisticAssignees.filter((u) => u.id !== userId)
        )
        // 2. API Call
        removeMutation.mutate({ jobId, memberId: userId })
    }

    const isWorking = assignMutation.isPending || removeMutation.isPending

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="3xl"
            backdrop="blur"
            hideCloseButton={isWorking}
            style={{
                minHeight: 600,
            }}
        >
            <ModalContent>
                {(close) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <Users className="text-text-default" />
                                <span className="text-xl font-bold">
                                    Manage Team
                                </span>
                            </div>
                        </ModalHeader>
                        <ModalBody className="p-0 flex flex-row h-[500px]">
                            {/* LEFT: Search & Add */}
                            <div className="w-1/2 p-4 border-r border-border-default flex flex-col bg-background/60">
                                <Input
                                    placeholder="Search staff..."
                                    startContent={<Search size={16} />}
                                    className="mb-4"
                                    value={searchQuery}
                                    onValueChange={setSearchQuery}
                                />
                                <ScrollShadow className="h-full">
                                    {availableUsers.map((user) => (
                                        <div
                                            key={user.id}
                                            className="flex items-center justify-between p-2 rounded-lg hover:bg-background-hovered cursor-pointer group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Avatar
                                                    src={optimizeCloudinary(
                                                        user.avatar,
                                                        {
                                                            width: 256,
                                                            height: 256,
                                                        }
                                                    )}
                                                    size="sm"
                                                />
                                                <div>
                                                    <p className="text-sm font-semibold">
                                                        {user.displayName}
                                                    </p>
                                                    <p className="text-[10px] text-text-subdued">
                                                        @{user.username}
                                                    </p>
                                                </div>
                                            </div>
                                            <HeroButton
                                                isIconOnly
                                                size="sm"
                                                variant="light"
                                                color="warning"
                                                className="opacity-0 group-hover:opacity-100"
                                                onClick={() => handleAdd(user)}
                                            >
                                                <Plus size={16} />
                                            </HeroButton>
                                        </div>
                                    ))}
                                </ScrollShadow>
                            </div>

                            {/* RIGHT: Assigned List */}
                            <div className="w-1/2 p-4 flex flex-col bg-background/60">
                                <p className="text-xs font-bold text-text-default uppercase mb-4">
                                    Assigned ({optimisticAssignees.length})
                                </p>
                                <ScrollShadow className="h-full space-y-2">
                                    {optimisticAssignees.map((user) => (
                                        <div
                                            key={user.id}
                                            className="flex items-center justify-between p-2 border border-border-default rounded-lg"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Avatar
                                                    src={optimizeCloudinary(
                                                        user.avatar,
                                                        {
                                                            width: 256,
                                                            height: 256,
                                                        }
                                                    )}
                                                    size="sm"
                                                />
                                                <p className="text-sm font-bold">
                                                    {user.displayName}
                                                </p>
                                            </div>
                                            <Button
                                                isIconOnly
                                                size="sm"
                                                color="danger"
                                                variant="light"
                                                onPress={() =>
                                                    handleRemove(user.id)
                                                }
                                            >
                                                <X size={16} />
                                            </Button>
                                        </div>
                                    ))}
                                </ScrollShadow>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color="primary"
                                onPress={close}
                                disabled={isWorking}
                            >
                                {isWorking ? (
                                    <Spinner size="sm" color="white" />
                                ) : (
                                    'Done'
                                )}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}
