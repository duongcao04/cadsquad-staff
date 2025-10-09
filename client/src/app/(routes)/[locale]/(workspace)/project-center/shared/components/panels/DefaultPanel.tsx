'use client'

import { HeroButton, HeroInput } from '@/shared/components'
import { RefreshCcw, Search } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { ViewSettingsDropdown } from '../ViewSettingsDropdown'

type Props = {
    defaultKeywords?: string
    onSearch?: (value: string) => void
    isRefreshing?: boolean
    onRefresh?: () => void
}
export function DefaultPanel({
    defaultKeywords = '',
    onSearch,
    isRefreshing = false,
    onRefresh,
}: Props) {
    const t = useTranslations()
    const [keywords, setKeywords] = useState(defaultKeywords)
    return (
        <div className="flex items-center justify-between gap-5">
            <div className="grid grid-cols-[500px_1fr] gap-3">
                <HeroInput
                    value={keywords}
                    startContent={<Search size={14} />}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        const value = event.target.value
                        setKeywords(value)
                        onSearch?.(value)
                    }}
                    placeholder={t('jobTableSearchHint')}
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
                    {t('refresh')}
                </HeroButton>
                {/* <FilterDropdown /> */}
                <ViewSettingsDropdown />
            </div>
        </div>
    )
}
