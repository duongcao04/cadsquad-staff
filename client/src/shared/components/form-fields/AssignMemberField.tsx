'use client'

import { Autocomplete, AutocompleteItem, Avatar, Chip } from '@heroui/react'
import { SearchIcon } from 'lucide-react'
import { Key, memo, useMemo, useState } from 'react'
import { optimizeCloudinary } from '../../../lib/cloudinary'
import { TUser } from '../../types'

interface Props {
    users: TUser[]
    assignees?: TUser[] // Đây chính là "selectedUser" state được truyền từ cha vào
    onSelectMember: (userId: string[]) => void
    onRemoveMember?: (userId: string) => void // Thêm function để xóa user
    loading?: boolean
}

const AssignMemberField = memo(function AssignMemberField({
    users,
    assignees = [],
    onSelectMember,
    onRemoveMember,
    loading = false,
}: Props) {
    const [inputValue, setInputValue] = useState('')

    // Tối ưu 1: Map Assignees -> Set ID
    const assignedUserIds = useMemo(() => {
        const safeAssignees = Array.isArray(assignees) ? assignees : []
        return new Set(safeAssignees.map((u) => u.id))
    }, [assignees])

    const [selectedUsers, setSelectedUsers] =
        useState<Set<string>>(assignedUserIds)

    // Tối ưu 2: Filter Available Users
    const availableUsers = useMemo(() => {
        if (!Array.isArray(users)) return []

        const search = inputValue.trim().toLowerCase()
        const results: TUser[] = []

        // Case A: No search
        if (!search) {
            for (const user of users) {
                if (results.length >= 20) break
                if (!selectedUsers.has(user.id)) {
                    results.push(user)
                }
            }
            return results
        }

        // Case B: Has search
        for (const user of users) {
            if (results.length >= 50) break
            if (selectedUsers.has(user.id)) continue

            const fullText = `${user.displayName} ${user.email} ${
                user.username
            } ${user.department?.displayName || ''}`.toLowerCase()

            if (fullText.includes(search)) {
                results.push(user)
            }
        }
        return results
    }, [users, selectedUsers, inputValue])

    const handleSelectionChange = (key: Key | null) => {
        if (!key) return

        const newKey = String(key)

        // 1. Tính toán danh sách mới trước (để tránh stale state)
        // Lưu ý: convert Set sang Array để spread
        const newSelectedUsers = new Set([...selectedUsers, newKey])

        // 2. Cập nhật State nội bộ
        setSelectedUsers(newSelectedUsers)

        // 3. Gửi danh sách MỚI NHẤT lên cha (convert Set -> Array)
        onSelectMember(Array.from(newSelectedUsers))

        setTimeout(() => {
            setInputValue('')
        }, 0)
    }

    return (
        <div className="flex flex-col gap-3">
            {/* 1. INPUT AREA */}
            <Autocomplete
                aria-label="Select member"
                classNames={{
                    base: 'w-full',
                    listboxWrapper: 'max-h-[320px]',
                    selectorButton: 'text-default-500',
                }}
                listboxProps={{
                    hideSelectedIcon: true,
                }}
                items={availableUsers}
                inputValue={inputValue}
                onInputChange={setInputValue}
                onSelectionChange={handleSelectionChange}
                placeholder="Type to search & add members..."
                radius="full"
                variant="bordered"
                isLoading={loading}
                startContent={
                    <SearchIcon className="text-default-400" size={18} />
                }
                allowsCustomValue={false}
                isClearable={false}
            >
                {(user) => (
                    <AutocompleteItem
                        key={user.id}
                        textValue={user.displayName}
                    >
                        <div className="flex gap-2 items-center">
                            <Avatar
                                alt={user.displayName}
                                className="shrink-0"
                                size="sm"
                                src={optimizeCloudinary(user.avatar)}
                            />
                            <div className="flex flex-col">
                                <span className="text-small font-medium">
                                    {user.displayName}
                                </span>
                                <span className="text-tiny text-default-400">
                                    {user.department?.displayName || user.email}
                                </span>
                            </div>
                        </div>
                    </AutocompleteItem>
                )}
            </Autocomplete>

            {/* 2. SELECTED USERS DISPLAY (Show selectedUser by array) */}
            {users.filter((user) => selectedUsers.has(user.id)).length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {users
                        .filter((user) => selectedUsers.has(user.id))
                        .map((user) => (
                            <Chip
                                key={user.id}
                                variant="flat"
                                color="primary"
                                avatar={
                                    <Avatar
                                        name={user.displayName}
                                        src={optimizeCloudinary(user.avatar)}
                                    />
                                }
                                // Chỉ hiện nút xóa nếu có truyền hàm onRemoveMember
                                onClose={
                                    onRemoveMember
                                        ? () => onRemoveMember(user.id)
                                        : undefined
                                }
                                classNames={{
                                    base: 'pl-1 h-8', // Chỉnh padding để Avatar đẹp hơn
                                    content: 'font-medium text-small pr-1',
                                }}
                            >
                                {user.displayName}
                            </Chip>
                        ))}
                </div>
            )}
        </div>
    )
})

export default AssignMemberField
