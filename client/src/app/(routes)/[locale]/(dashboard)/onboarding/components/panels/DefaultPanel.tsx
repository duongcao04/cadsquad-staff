import React, { useState } from 'react'
import FilterDropdown from '../FilterDropdown'
import ViewSettingsDropdown from '../ViewSettingsDropdown'
import { RefreshCcw, Search } from 'lucide-react'
import { Button } from '@heroui/react'
import HeroInput from '@/shared/components/customize/HeroInput'
import { HeroButton } from '../../../../../../../shared/components/customize/HeroButton'

type Props = {
    defaultKeywords?: string
    onSearch?: (value: string) => void
    isRefreshing?: boolean
    onRefresh?: () => void
}
export default function DefaultPanel({
    defaultKeywords = '',
    onSearch,
    isRefreshing = false,
    onRefresh,
}: Props) {
    const [keywords, setKeywords] = useState(defaultKeywords)
    return (
        <div className="flex items-center justify-between gap-5">
            <div className="grid grid-cols-[400px_1fr] gap-3">
                <HeroInput
                    value={keywords}
                    startContent={<Search size={14} />}
                    onChange={(event) => {
                        const value = event.target.value
                        setKeywords(value)
                        onSearch?.(value)
                    }}
                    placeholder="Tìm kiếm theo mã, tên dự án, khách hàng,..."
                />
            </div>
            <div className="flex items-center justify-end gap-2.5">
                <HeroButton
                    startContent={
                        <RefreshCcw
                            size={14}
                            className={isRefreshing ? 'animate-spin' : ''}
                        />
                    }
                    variant="bordered"
                    onPress={onRefresh}
                >
                    Refresh
                </HeroButton>
                <FilterDropdown />
                <ViewSettingsDropdown />
            </div>
        </div>
    )
}
