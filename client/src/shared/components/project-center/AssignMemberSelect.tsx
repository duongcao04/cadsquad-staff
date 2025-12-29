'use client'

import { Autocomplete, AutocompleteItem, Avatar } from '@heroui/react'
import { SearchIcon } from 'lucide-react'
import { Key, memo, useMemo, useState } from 'react'

import { optimizeCloudinary } from '@/lib/cloudinary'

import { TJob, TUser } from '../../types'

interface Props {
    users: TUser[]
    job: TJob
    onSelectMember: (userId: Key | null) => void
    loading?: boolean
}

// 1. Dùng React.memo để chặn re-render nếu props không đổi
const AssignMemberSelect = memo(function AssignMemberSelect({
    users,
    job,
    onSelectMember,
    loading = false,
}: Props) {
    const [inputValue, setInputValue] = useState('')

    // Tối ưu 1: Set ID vẫn giữ nguyên
    const assignedUserIds = useMemo(() => {
        return new Set(job?.assignee?.map((u) => u.id))
    }, [job?.assignee])

    const availableUsers = useMemo(() => {
        if (!users) return []
        const search = inputValue.trim().toLowerCase()

        // Tối ưu 2: Không filter nếu chưa có input (để tránh lag lúc mới mở nếu list quá dài)
        // Hoặc chỉ trả về 20 người đầu tiên nếu không search
        if (!search) {
            return users.filter((u) => !assignedUserIds.has(u.id)).slice(0, 20) // QUAN TRỌNG: Chỉ lấy 20 người mặc định
        }

        // Tối ưu 3: Filter và Limit kết quả
        const results = []
        for (const user of users) {
            // Dừng vòng lặp ngay khi đủ số lượng để giảm tải render (VÍ DỤ: 50 người)
            if (results.length >= 50) break

            if (assignedUserIds.has(user.id)) continue

            const fullText =
                `${user.displayName} ${user.email} ${user.username} ${user.department?.displayName}`.toLowerCase()

            if (fullText.includes(search)) {
                results.push(user)
            }
        }
        return results
    }, [users, assignedUserIds, inputValue])

    const handleSelectionChange = (key: React.Key | null) => {
        if (!key) return
        onSelectMember(key as string)
        // Reset input sau khi chọn để UX mượt hơn
        setInputValue('')
    }

    return (
        <Autocomplete
            aria-label="Select member"
            classNames={{
                base: 'w-full',
                listboxWrapper: 'max-h-[320px]',
                selectorButton: 'text-default-500',
            }}
            items={availableUsers}
            inputValue={inputValue}
            onInputChange={setInputValue}
            onSelectionChange={handleSelectionChange}
            placeholder="Enter member name"
            radius="full"
            variant="bordered"
            isLoading={loading}
            startContent={<SearchIcon className="text-default-400" size={18} />}
        >
            {(user) => (
                <AutocompleteItem key={user.id} textValue={user.displayName}>
                    <div className="flex justify-between items-center">
                        <div className="flex gap-2 items-center">
                            <Avatar
                                alt={user.displayName}
                                className="shrink-0"
                                size="sm"
                                src={optimizeCloudinary(user.avatar)}
                            />
                            <div className="flex flex-col">
                                <span className="text-small">
                                    {user.displayName}
                                </span>
                                <span className="text-tiny text-default-400">
                                    {user.department?.displayName}
                                </span>
                            </div>
                        </div>
                    </div>
                </AutocompleteItem>
            )}
        </Autocomplete>
    )
})

export default AssignMemberSelect
