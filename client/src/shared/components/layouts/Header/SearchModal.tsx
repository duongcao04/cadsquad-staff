import { SYSTEM_ROUTES } from '@/lib/utils'
import {
    Chip,
    Input,
    Kbd,
    Listbox,
    ListboxItem,
    Tab,
    Tabs,
} from '@heroui/react'
import { useNavigate } from '@tanstack/react-router'
import {
    BriefcaseIcon,
    ChevronRightIcon,
    HistoryIcon,
    LayoutGridIcon,
    SearchIcon,
    SettingsIcon,
    UserCircleIcon,
    UsersIcon,
} from 'lucide-react'
import React, { useMemo, useState } from 'react'
import { HeroModal, HeroModalContent, HeroModalBody } from '../../ui/hero-modal'

// --- Types ---
type Category = 'All' | 'Jobs' | 'Communities' | 'Clients' | 'System'

// --- SearchModal Component ---
export const SearchModal = ({
    isOpen,
    onClose,
    userRole = 'USER', // Pass this from your Auth context
}: {
    isOpen: boolean
    onClose: () => void
    userRole?: 'ADMIN' | 'ACCOUNTING' | 'USER'
}) => {
    const [query, setQuery] = useState('')
    const [activeTab, setActiveTab] = useState<Category>('All')
    const navigate = useNavigate()

    // 1. Filter results based on Permissions, Query, and Active Tab
    const filteredResults = useMemo(() => {
        // Start with System Routes + Any dynamic data (Jobs/Communities)
        const allItems = [...SYSTEM_ROUTES]

        return allItems.filter((item) => {
            // Check Role Permission
            const hasPermission = item.allowRoles.includes(userRole)
            if (!hasPermission) return false

            // Check Tab Category
            const matchesTab =
                activeTab === 'All' || item.category === activeTab

            // Check Search Query (if query exists)
            const matchesQuery = query
                ? item.title.toLowerCase().includes(query.toLowerCase()) ||
                  item.subtitle?.toLowerCase().includes(query.toLowerCase())
                : true // If no query, show everything in that tab (or "Recent")

            return matchesTab && matchesQuery
        })
    }, [query, activeTab, userRole])

    // Handle Selection
    const handleSelect = (route: string) => {
        navigate({ to: route })
        setQuery('')
        onClose()
    }

    return (
        <HeroModal
            isOpen={isOpen}
            onOpenChange={onClose}
            hideCloseButton
            placement="top"
            size="2xl"
            classNames={{
                base: 'mt-[8vh] bg-background border border-default-200 shadow-2xl overflow-hidden',
                backdrop: 'bg-zinc-900/50 backdrop-blur-sm',
            }}
        >
            <HeroModalContent>
                <HeroModalBody className="p-0">
                    {/* --- Search Input Section --- */}
                    <div className="flex items-center px-4 pt-4">
                        <Input
                            autoFocus
                            placeholder="Search everything or jump to page..."
                            variant="flat"
                            startContent={
                                <SearchIcon
                                    className="text-default-400"
                                    size={20}
                                />
                            }
                            endContent={
                                <div className="flex items-center gap-1">
                                    <Kbd
                                        keys={['command']}
                                        className="hidden sm:inline-flex"
                                    >
                                        K
                                    </Kbd>
                                </div>
                            }
                            classNames={{
                                inputWrapper:
                                    'bg-transparent shadow-none border-none',
                                input: 'text-lg h-12',
                            }}
                            value={query}
                            onValueChange={setQuery}
                        />
                    </div>

                    {/* --- Tabs Section --- */}
                    <div className="px-4 pb-2 border-b border-default-100">
                        <Tabs
                            variant="underlined"
                            aria-label="Search Categories"
                            selectedKey={activeTab}
                            onSelectionChange={(key) =>
                                setActiveTab(key as Category)
                            }
                            classNames={{
                                tabList: 'gap-4',
                                cursor: 'w-full bg-primary',
                                tab: 'max-w-fit px-0 h-10',
                                tabContent:
                                    'group-data-[selected=true]:text-primary font-medium',
                            }}
                        >
                            <Tab
                                key="All"
                                title={
                                    <TabHeader
                                        icon={<LayoutGridIcon size={16} />}
                                        text="All"
                                    />
                                }
                            />
                            <Tab
                                key="Jobs"
                                title={
                                    <TabHeader
                                        icon={<BriefcaseIcon size={16} />}
                                        text="Jobs"
                                    />
                                }
                            />
                            <Tab
                                key="Communities"
                                title={
                                    <TabHeader
                                        icon={<UsersIcon size={16} />}
                                        text="Communities"
                                    />
                                }
                            />
                            <Tab
                                key="Clients"
                                title={
                                    <TabHeader
                                        icon={<UserCircleIcon size={16} />}
                                        text="Clients"
                                    />
                                }
                            />
                            <Tab
                                key="System"
                                title={
                                    <TabHeader
                                        icon={<SettingsIcon size={16} />}
                                        text="System"
                                    />
                                }
                            />
                        </Tabs>
                    </div>

                    {/* --- Results Section --- */}
                    <div className="max-h-112.5 overflow-y-auto p-2 scrollbar-hide">
                        {filteredResults.length > 0 ? (
                            <Listbox
                                aria-label="Search results"
                                onAction={(key) => handleSelect(key as string)}
                                variant="flat"
                            >
                                {filteredResults.map((item) => (
                                    <ListboxItem
                                        key={item.route}
                                        className="py-3 px-4 rounded-xl"
                                        textValue={item.title}
                                        startContent={
                                            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-default-100 text-default-500">
                                                {item.icon ||
                                                    (!query ? (
                                                        <HistoryIcon
                                                            size={18}
                                                        />
                                                    ) : (
                                                        <SearchIcon size={18} />
                                                    ))}
                                            </div>
                                        }
                                        endContent={
                                            <ChevronRightIcon
                                                size={14}
                                                className="text-default-300"
                                            />
                                        }
                                    >
                                        <div className="flex justify-between items-center w-full ml-1">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-default-900 leading-tight">
                                                    {item.title}
                                                </span>
                                                <span className="text-tiny text-default-400">
                                                    {item.subtitle}
                                                </span>
                                            </div>
                                            {activeTab === 'All' && (
                                                <Chip
                                                    size="sm"
                                                    variant="flat"
                                                    className="capitalize text-[10px] h-5"
                                                >
                                                    {item.category}
                                                </Chip>
                                            )}
                                        </div>
                                    </ListboxItem>
                                ))}
                            </Listbox>
                        ) : (
                            <div className="py-20 flex flex-col items-center justify-center text-default-400 gap-2">
                                <SearchIcon size={40} className="opacity-10" />
                                <p className="text-sm">
                                    No results found in{' '}
                                    <span className="font-bold">
                                        {activeTab}
                                    </span>
                                </p>
                            </div>
                        )}
                    </div>

                    {/* --- Footer Guide --- */}
                    <div className="px-4 py-2.5 border-t border-default-100 bg-default-50/50 flex justify-between items-center">
                        <div className="flex gap-4">
                            <span className="text-[10px] text-default-400 flex items-center gap-1">
                                <Kbd className="py-0 px-1 text-[10px]">ESC</Kbd>{' '}
                                Close
                            </span>
                            <span className="text-[10px] text-default-400 flex items-center gap-1">
                                <Kbd className="py-0 px-1 text-[10px]">↑↓</Kbd>{' '}
                                Navigate
                            </span>
                            <span className="text-[10px] text-default-400 flex items-center gap-1">
                                <Kbd className="py-0 px-1 text-[10px]">
                                    ENTER
                                </Kbd>{' '}
                                Open
                            </span>
                        </div>
                    </div>
                </HeroModalBody>
            </HeroModalContent>
        </HeroModal>
    )
}

// --- Sub-component for Tab Headers ---
const TabHeader = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
    <div className="flex items-center gap-2">
        {icon}
        <span>{text}</span>
    </div>
)
