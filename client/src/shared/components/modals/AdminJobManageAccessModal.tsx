import React, { useState, useMemo } from 'react'
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Avatar,
    User,
    Chip,
    ScrollShadow,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
} from '@heroui/react'
import {
    Search,
    X,
    Shield,
    Trash2,
    UserPlus,
    MoreVertical,
    Mail,
} from 'lucide-react'
import { TUser } from '../../types'
import { useAssignMemberMutation, useRemoveMemberMutation } from '../../../lib'
import { RoleEnum } from '../../enums'

// --- Mock Data (Replace with API) ---
const ALL_USERS = [
    {
        id: 'u1',
        name: 'Sarah Wilson',
        email: 'sarah@hiveq.com',
        role: 'Lead Dev',
        avatar: 'https://i.pravatar.cc/150?u=sarah',
    },
    {
        id: 'u2',
        name: 'David Chen',
        email: 'david@hiveq.com',
        role: 'Designer',
        avatar: 'https://i.pravatar.cc/150?u=david',
    },
    {
        id: 'u3',
        name: 'Emily Johnson',
        email: 'emily@hiveq.com',
        role: 'Manager',
        avatar: 'https://i.pravatar.cc/150?u=emily',
    },
    {
        id: 'u4',
        name: 'Michael Brown',
        email: 'mike@hiveq.com',
        role: 'Developer',
        avatar: 'https://i.pravatar.cc/150?u=mike',
    },
    {
        id: 'u5',
        name: 'Jessica Lee',
        email: 'jess@hiveq.com',
        role: 'QA',
        avatar: 'https://i.pravatar.cc/150?u=jess',
    },
]

interface ManageAccessModalProps {
    isOpen: boolean
    onClose: () => void
    jobId: string
    jobTitle?: string
    currentMembers: TUser[]
}

export const AdminJobManageAccessModal = ({
    isOpen,
    onClose,
    jobId,
    jobTitle,
    currentMembers,
}: ManageAccessModalProps) => {
    const [searchQuery, setSearchQuery] = useState('')
    // Local state for optimistic UI updates
    const [members, setMembers] = useState(currentMembers)

    const assignMutation = useAssignMemberMutation()
    const removeMutation = useRemoveMemberMutation()

    // Reset local state when modal opens
    React.useEffect(() => {
        if (isOpen) {
            setMembers(currentMembers)
            setSearchQuery('')
        }
    }, [isOpen, currentMembers])

    // Filter Logic: Show users who are NOT already members matching the search
    const searchResults = useMemo(() => {
        if (!searchQuery) return []
        const memberIds = new Set(members.map((m) => m.id))
        return ALL_USERS.filter(
            (u) =>
                !memberIds.has(u.id) &&
                (u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    u.email.toLowerCase().includes(searchQuery.toLowerCase()))
        )
    }, [searchQuery, members])

    // --- Handlers ---

    const handleInvite = (user: TUser) => {
        // 1. Optimistic Update
        setMembers([...members, user])
        setSearchQuery('') // Clear search after adding

        // 2. API Call
        assignMutation.mutate({
            jobId,
            assignMemberInput: {
                prevMemberIds: user.id,
                updateMemberIds: user.id,
            },
        })
    }

    const handleRemove = (userId: string) => {
        // 1. Optimistic Update
        setMembers(members.filter((m) => m.id !== userId))

        // 2. API Call
        removeMutation.mutate({ jobId, memberId: userId })
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="lg"
            backdrop="blur"
            classNames={{
                base: 'max-h-[80vh]',
            }}
        >
            <ModalContent>
                {(close) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1 border-b border-slate-100">
                            <span className="text-xl font-bold">
                                Manage Access
                            </span>
                            {jobTitle && (
                                <span className="text-xs font-normal text-slate-500">
                                    For job:{' '}
                                    <strong className="text-slate-700">
                                        {jobTitle}
                                    </strong>
                                </span>
                            )}
                        </ModalHeader>

                        <ModalBody className="p-0">
                            {/* 1. Invite Section */}
                            <div className="p-6 bg-slate-50 border-b border-slate-100">
                                <Input
                                    placeholder="Add people by name or email..."
                                    startContent={
                                        <Search
                                            className="text-slate-400"
                                            size={18}
                                        />
                                    }
                                    value={searchQuery}
                                    onValueChange={setSearchQuery}
                                    variant="bordered"
                                    classNames={{
                                        inputWrapper: 'bg-white shadow-sm',
                                    }}
                                    endContent={
                                        searchQuery && (
                                            <button
                                                onClick={() =>
                                                    setSearchQuery('')
                                                }
                                            >
                                                <X
                                                    size={16}
                                                    className="text-slate-400 hover:text-slate-600"
                                                />
                                            </button>
                                        )
                                    }
                                />

                                {/* Search Results Dropdown Area */}
                                {searchQuery && (
                                    <div className="mt-2 bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2">
                                        {searchResults.length === 0 ? (
                                            <div className="p-4 text-center text-slate-500 text-sm">
                                                No users found.
                                            </div>
                                        ) : (
                                            searchResults.map((user) => (
                                                <div
                                                    key={user.id}
                                                    className="flex items-center justify-between p-3 hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-50 last:border-0"
                                                    onClick={() =>
                                                        handleInvite(
                                                            user as unknown as TUser
                                                        )
                                                    }
                                                >
                                                    <User
                                                        name={user.name}
                                                        description={user.email}
                                                        avatarProps={{
                                                            src: user.avatar,
                                                            size: 'sm',
                                                        }}
                                                    />
                                                    <Button
                                                        size="sm"
                                                        color="primary"
                                                        variant="flat"
                                                        startContent={
                                                            <UserPlus
                                                                size={16}
                                                            />
                                                        }
                                                    >
                                                        Add
                                                    </Button>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* 2. Current Members List */}
                            <div className="px-6 py-4">
                                <h3 className="text-xs font-bold text-slate-400 uppercase mb-4">
                                    People with access ({members.length})
                                </h3>

                                <ScrollShadow className="max-h-75 pr-2">
                                    <div className="space-y-4">
                                        {members.map((member) => (
                                            <div
                                                key={member.id}
                                                className="flex items-center justify-between group"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Avatar
                                                        src={member.avatar}
                                                    />
                                                    <div>
                                                        <p className="font-semibold text-slate-700 text-sm flex items-center gap-2">
                                                            {member.displayName}
                                                            {member.role ===
                                                                RoleEnum.ADMIN && (
                                                                <Chip
                                                                    size="sm"
                                                                    color="warning"
                                                                    variant="flat"
                                                                    className="h-5 px-1 text-[10px]"
                                                                >
                                                                    Lead
                                                                </Chip>
                                                            )}
                                                        </p>
                                                        <p className="text-xs text-slate-400 flex items-center gap-1">
                                                            <Mail size={10} />{' '}
                                                            {member.email}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-slate-400 mr-2 hidden sm:block">
                                                        {member.role}
                                                    </span>

                                                    <Dropdown>
                                                        <DropdownTrigger>
                                                            <Button
                                                                isIconOnly
                                                                size="sm"
                                                                variant="light"
                                                                className="text-slate-400"
                                                            >
                                                                <MoreVertical
                                                                    size={16}
                                                                />
                                                            </Button>
                                                        </DropdownTrigger>
                                                        <DropdownMenu aria-label="Member Actions">
                                                            <DropdownItem key="profile">
                                                                View Profile
                                                            </DropdownItem>
                                                            <DropdownItem
                                                                key="remove"
                                                                className="text-danger"
                                                                color="danger"
                                                                startContent={
                                                                    <Trash2
                                                                        size={
                                                                            16
                                                                        }
                                                                    />
                                                                }
                                                                onPress={() =>
                                                                    handleRemove(
                                                                        member.id
                                                                    )
                                                                }
                                                            >
                                                                Remove Access
                                                            </DropdownItem>
                                                        </DropdownMenu>
                                                    </Dropdown>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollShadow>
                            </div>
                        </ModalBody>

                        <ModalFooter className="bg-slate-50 border-t border-slate-100 flex justify-between">
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                <Shield size={14} /> Only Admins can manage
                                access
                            </div>
                            <Button color="primary" onPress={close}>
                                Done
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}
