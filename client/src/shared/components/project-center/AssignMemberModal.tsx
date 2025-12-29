import {
    Autocomplete,
    AutocompleteItem,
    Avatar,
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from '@heroui/react'
import { Trash2, UserPlus, Wallet, Search } from 'lucide-react'
import { useMemo, useState } from 'react'

// --- FAKE DATA ---
const FAKE_USERS = [
    {
        id: '1',
        displayName: 'Chieu Duong',
        avatar: 'https://i.pravatar.cc/150?u=1',
    },
    {
        id: '2',
        displayName: 'Minh Hoang',
        avatar: 'https://i.pravatar.cc/150?u=2',
    },
    {
        id: '3',
        displayName: 'Thanh Thao',
        avatar: 'https://i.pravatar.cc/150?u=3',
    },
    {
        id: '4',
        displayName: 'Quoc Anh',
        avatar: 'https://i.pravatar.cc/150?u=4',
    },
    {
        id: '5',
        displayName: 'Gia Bao',
        avatar: 'https://i.pravatar.cc/150?u=5',
    },
]

type AssignedMember = {
    userId: string
    displayName: string
    avatar?: string
    staffCost: number
}

export default function AssignMemberModal({
    jobNo = 'F.26001',
    isOpen,
    onClose,
}: {
    jobNo?: string
    isOpen: boolean
    onClose: () => void
}) {
    const [assignedMembers, setAssignedMembers] = useState<AssignedMember[]>([])

    // --- LOGIC: Filter members ---
    // This derived state only contains users NOT currently in the assigned list
    const availableUsers = useMemo(() => {
        const assignedIds = assignedMembers.map((m) => m.userId)
        return FAKE_USERS.filter((user) => !assignedIds.includes(user.id))
    }, [assignedMembers])

    const totalStaffCost = useMemo(
        () => assignedMembers.reduce((sum, m) => sum + m.staffCost, 0),
        [assignedMembers]
    )

    const handleAddMember = (userId: string | number | null) => {
        if (!userId) return

        const user = FAKE_USERS.find((u) => u.id === String(userId))
        if (!user) return

        setAssignedMembers((prev) => [
            ...prev,
            {
                userId: user.id,
                displayName: user.displayName,
                avatar: user.avatar,
                staffCost: 0,
            },
        ])
    }

    const handleUpdateCost = (userId: string, value: string) => {
        const numericValue = parseFloat(value) || 0
        setAssignedMembers((prev) =>
            prev.map((m) =>
                m.userId === userId ? { ...m, staffCost: numericValue } : m
            )
        )
    }

    const handleRemoveMember = (userId: string) => {
        setAssignedMembers((prev) => prev.filter((m) => m.userId !== userId))
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="2xl" backdrop="blur">
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1 border-b border-divider">
                    <span>Assign Members</span>
                    <span className="text-xs font-normal text-default-400">
                        Project #{jobNo}
                    </span>
                </ModalHeader>
                <ModalBody className="py-6">
                    <div className="flex flex-col gap-6">
                        {/* 1. Selection with filter logic */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-default-700">
                                Add Staff Member
                            </label>
                            <Autocomplete
                                placeholder="Search by name..."
                                variant="bordered"
                                allowsCustomValue={false}
                                onSelectionChange={handleAddMember}
                                startContent={
                                    <Search
                                        size={18}
                                        className="text-default-400"
                                    />
                                }
                                // Use the filtered list here
                                items={availableUsers}
                                // Prevent item from appearing if list is empty
                                emptyContent="No more members available to add"
                            >
                                {(user) => (
                                    <AutocompleteItem
                                        key={user.id}
                                        textValue={user.displayName}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Avatar
                                                size="sm"
                                                src={user.avatar}
                                            />
                                            <span className="text-small">
                                                {user.displayName}
                                            </span>
                                        </div>
                                    </AutocompleteItem>
                                )}
                            </Autocomplete>
                        </div>

                        {/* 2. Assigned List */}
                        <div className="space-y-3">
                            <p className="text-xs font-bold text-default-400 uppercase px-1 tracking-wider">
                                Assigned List ({assignedMembers.length})
                            </p>

                            <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
                                {assignedMembers.length === 0 ? (
                                    <div className="py-8 text-center border-2 border-dashed border-divider rounded-2xl text-default-400 text-sm">
                                        Use the search above to add members.
                                    </div>
                                ) : (
                                    assignedMembers.map((member) => (
                                        <div
                                            key={member.userId}
                                            className="flex items-center gap-4 p-3 bg-default-50 rounded-2xl border border-default-100 transition-all hover:border-primary-300"
                                        >
                                            <div className="flex items-center gap-3 flex-1">
                                                <Avatar
                                                    src={member.avatar}
                                                    size="sm"
                                                    isBordered
                                                    color="primary"
                                                />
                                                <span className="text-sm font-semibold">
                                                    {member.displayName}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="number"
                                                    variant="flat"
                                                    size="sm"
                                                    placeholder="0"
                                                    value={member.staffCost.toString()}
                                                    onValueChange={(val) =>
                                                        handleUpdateCost(
                                                            member.userId,
                                                            val
                                                        )
                                                    }
                                                    className="w-36"
                                                    endContent={
                                                        <span className="text-[10px] font-bold text-default-400">
                                                            VND
                                                        </span>
                                                    }
                                                />
                                                <Button
                                                    isIconOnly
                                                    size="sm"
                                                    variant="light"
                                                    color="danger"
                                                    onPress={() =>
                                                        handleRemoveMember(
                                                            member.userId
                                                        )
                                                    }
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </ModalBody>

                {/* 3. Footer with Summary */}
                <ModalFooter className="flex-col items-stretch gap-4 border-t border-divider">
                    <div className="flex justify-between items-center bg-primary-50 p-4 rounded-2xl border border-primary-100">
                        <div className="flex items-center gap-2 text-primary font-bold">
                            <Wallet size={20} />
                            <span>Total Staff Cost</span>
                        </div>
                        <div className="text-right">
                            <span className="text-xl font-black text-primary">
                                {totalStaffCost.toLocaleString()}
                            </span>
                            <span className="ml-1 text-xs font-bold text-primary">
                                VND
                            </span>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button variant="flat" onPress={onClose}>
                            Cancel
                        </Button>
                        <Button
                            color="primary"
                            className="font-bold px-10"
                            onPress={() => onClose()}
                        >
                            Save Assignments
                        </Button>
                    </div>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
