'use client'

import React, { useEffect, useState } from 'react'

import {
    BreadcrumbItem,
    Breadcrumbs,
    Button,
    Input,
    Tab,
    Tabs,
} from '@heroui/react'
import {
    AlignJustify,
    FolderPlus,
    HomeIcon,
    LayoutGrid,
    SearchIcon,
    Upload,
} from 'lucide-react'

import { useDebouncedValue } from '@/hooks/useDebounce'

import { useSearchParam } from '@/shared/hooks/useSearchParam'

import { ROOT_DIR } from '../../actions'

const DEBOUNCE_VALUE = 250

type Props = {
    onOpenNewFolderModal: () => void
    onOpenUploadModal: () => void
}

export default function FileManagerHeader({
    onOpenNewFolderModal,
    onOpenUploadModal,
}: Props) {
    const { getSearchParam, setSearchParams, removeSearchParam } =
        useSearchParam()

    // Local state for immediate UI updates
    const [inputValue, setInputValue] = useState<string>(
        getSearchParam('search') ?? ''
    )

    const viewMode = getSearchParam('mode') ?? 'list'
    const currentPath = getSearchParam('directory') ?? ROOT_DIR

    const breadcrumbItems = currentPath.split('_')

    // Debounced search value - will only update after user stops typing
    const debouncedSearchValue = useDebouncedValue<string>(
        inputValue,
        DEBOUNCE_VALUE
    )

    // Handle breadcrumb navigation
    const navigateToBreadcrumb = (index: number) => {
        console.log(currentPath.slice(0, index + 1))

        // setCurrentPath(currentPath.slice(0, index + 1))
        // setSelectedFiles([])
    }

    // Update URL params when debounced value changes
    useEffect(() => {
        if (debouncedSearchValue.trim()) {
            setSearchParams({
                search: debouncedSearchValue,
            })
        } else {
            removeSearchParam('search')
        }
    }, [debouncedSearchValue, setSearchParams, removeSearchParam])

    // Sync local state with URL params when component mounts or URL changes externally
    useEffect(() => {
        const urlSearchValue = getSearchParam('search') ?? ''
        if (urlSearchValue !== inputValue) {
            setInputValue(urlSearchValue)
        }
    }, [getSearchParam('search')])

    // Handle input change - this will update immediately for UI responsiveness
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setInputValue(value)
    }

    const tabs = [
        {
            id: 'list',
            label: <AlignJustify size={16} />,
        },
        {
            id: 'grid',
            label: <LayoutGrid size={16} />,
        },
    ]

    return (
        <div className="pt-3 pb-5 grid grid-cols-[850px_1fr] items-center gap-5">
            <div className="bg-[#f4f4f5] py-2.5 px-5 rounded-xl">
                <Breadcrumbs>
                    <BreadcrumbItem
                        onPress={() => removeSearchParam('directory')}
                    >
                        <HomeIcon size={18} />
                    </BreadcrumbItem>
                    {breadcrumbItems.map((item, index) => {
                        const label = item.replaceAll('-', ' ')

                        return (
                            <BreadcrumbItem
                                key={item + index}
                                onPress={() => navigateToBreadcrumb(index)}
                            >
                                {label}
                            </BreadcrumbItem>
                        )
                    })}
                </Breadcrumbs>
            </div>

            <div className="flex items-center justify-end space-x-2">
                <Input
                    placeholder="Search files..."
                    value={inputValue}
                    onChange={handleInputChange}
                    startContent={<SearchIcon size={16} />}
                    classNames={{
                        base: 'w-[400px]',
                    }}
                />

                <Button
                    variant="bordered"
                    startContent={<FolderPlus size={16} />}
                    className="w-36"
                    onClick={() => onOpenNewFolderModal()}
                >
                    New Folder
                </Button>

                <Button
                    color="primary"
                    startContent={<Upload size={16} />}
                    className="w-36"
                    onClick={() => onOpenUploadModal()}
                >
                    Upload
                </Button>

                <Tabs
                    aria-label="Layout tabs"
                    items={tabs}
                    selectedKey={viewMode}
                >
                    {(item) => (
                        <Tab
                            key={item.id}
                            title={item.label}
                            onClick={() => {
                                setSearchParams({
                                    mode: item.id,
                                })
                            }}
                        />
                    )}
                </Tabs>
            </div>
        </div>
    )
}
