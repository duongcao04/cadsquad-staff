import { Suspense, useState, useDeferredValue } from 'react'
import { 
    Kbd,
    Input,
    Spinner,
    Tabs,
    Tab 
} from '@heroui/react'
import { 
    SearchIcon, 
    HistoryIcon,
    LayoutGridIcon,
    BriefcaseIcon,
    UserCircleIcon,
    SettingsIcon,
    UsersIcon,
    BadgeCheck
} from 'lucide-react'
import { HeroModal, HeroModalContent, HeroModalBody } from '@/shared/components/ui/hero-modal'
import { SearchResults } from './search-results'
import { SearchCategory } from '@/lib/queries'

interface SearchModalProps {
    isOpen: boolean
    onClose: () => void
}

export const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
    const [query, setQuery] = useState('')
    const [activeTab, setActiveTab] = useState<SearchCategory>('All')
    const deferredQuery = useDeferredValue(query)
    const isStale = query !== deferredQuery

    return (
        <HeroModal
            isOpen={isOpen}
            onOpenChange={onClose}
            hideCloseButton
            placement="top"
            size="2xl"
            classNames={{
                base: 'mt-[10vh] border border-default-200 shadow-2xl overflow-hidden',
                backdrop: 'bg-zinc-900/40 backdrop-blur-sm',
            }}
        >
            <HeroModalContent>
                <HeroModalBody className="p-0 min-h-[450px]">
                    {/* Header */}
                    <div className="flex items-center px-4 pt-4 pb-2">
                        <Input
                            autoFocus
                            value={query}
                            onValueChange={setQuery}
                            placeholder="Search everything..."
                            variant="flat"
                            size="lg"
                            startContent={
                                <SearchIcon 
                                    className={`text-default-400 transition-opacity ${isStale ? 'opacity-50' : 'opacity-100'}`} 
                                    size={20} 
                                />
                            }
                            endContent={
                                isStale ? <Spinner size="sm" color="default" /> : <Kbd keys={['command']} className="hidden sm:inline-flex shadow-none bg-default-100">K</Kbd>
                            }
                            classNames={{
                                inputWrapper: 'bg-transparent shadow-none border-none pl-1',
                                input: 'text-lg',
                            }}
                        />
                    </div>

                    {/* Tabs */}
                    <div className="px-4 border-b border-default-100 overflow-x-auto scrollbar-hide">
                        <Tabs
                            aria-label="Search Categories"
                            selectedKey={activeTab}
                            onSelectionChange={(key) => setActiveTab(key as SearchCategory)}
                            variant="underlined"
                            classNames={{
                                tabList: 'gap-4',
                                cursor: 'w-full bg-primary',
                                tab: 'max-w-fit px-0 h-10',
                                tabContent: 'group-data-[selected=true]:text-primary font-medium text-small',
                            }}
                        >
                            <Tab key="All" title={<TabHeader icon={<LayoutGridIcon size={14} />} text="All" />} />
                            <Tab key="Jobs" title={<TabHeader icon={<BriefcaseIcon size={14} />} text="Jobs" />} />
                            <Tab key="Clients" title={<TabHeader icon={<UserCircleIcon size={14} />} text="Clients" />} />
                            <Tab key="System" title={<TabHeader icon={<SettingsIcon size={14} />} text="System" />} />
                            <Tab key="Communities" title={<TabHeader icon={<UsersIcon size={14} />} text="Communities" />} />
                            <Tab key="Staff Members" title={<TabHeader icon={<BadgeCheck size={14} />} text="Staff" />} />
                        </Tabs>
                    </div>

                    {/* Results (Suspense) */}
                    <div className="flex-1 overflow-y-auto p-2 scrollbar-hide relative">
                        {!deferredQuery ? (
                            <div className="flex flex-col items-center justify-center h-full py-20 text-default-400 gap-3 opacity-60">
                                <HistoryIcon size={48} strokeWidth={1} />
                                <p className="text-sm">Start typing to search...</p>
                            </div>
                        ) : (
                            <Suspense 
                                fallback={
                                    <div className="flex flex-col items-center justify-center h-full py-20 gap-3">
                                        <Spinner size="lg" color="current" className="text-default-400"/>
                                        <p className="text-default-400 text-sm">Searching...</p>
                                    </div>
                                }
                            >
                                <div className={isStale ? 'opacity-50 transition-opacity duration-200' : 'opacity-100'}>
                                    <SearchResults 
                                        query={deferredQuery} 
                                        category={activeTab} 
                                        onSelect={() => {
                                            setQuery('')
                                            onClose()
                                        }}
                                    />
                                </div>
                            </Suspense>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-4 py-2 bg-default-50 border-t border-default-100 flex justify-between items-center text-[10px] text-default-400">
                         <div className="flex gap-3">
                            <span className="flex items-center gap-1"><Kbd className="h-4 min-h-4 text-[9px] px-1">ESC</Kbd> Close</span>
                            <span className="flex items-center gap-1"><Kbd className="h-4 min-h-4 text-[9px] px-1">↵</Kbd> Select</span>
                        </div>
                    </div>
                </HeroModalBody>
            </HeroModalContent>
        </HeroModal>
    )
}

const TabHeader = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
    <div className="flex items-center gap-1.5 whitespace-nowrap">
        {icon}
        <span>{text}</span>
    </div>
)