import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    ScrollShadow,
    useDisclosure,
} from '@heroui/react'
import { useRouterState } from '@tanstack/react-router'
import {
    EllipsisIcon,
    FileTextIcon,
    HashIcon,
    LightbulbIcon,
    MegaphoneIcon,
    MessageSquareIcon,
    PlusIcon,
    SearchIcon,
} from 'lucide-react'
import { CreateCommunityModal } from '../CreateCommunityModal'
import { useState } from 'react'
import { HeroButton } from '../../ui/hero-button'
import { CreateTopicModal } from '../CreateTopicModal'

export const COMMUNITIES = [
    {
        id: 'c-sales',
        name: 'CSD- Sales & Marketing',
        color: 'bg-pink-600',
        icon: 'S',
        banner: 'https://img.freepik.com/free-vector/abstract-technology-background_23-2148395279.jpg',
        channels: [
            {
                id: 'ch-1',
                name: 'Official Notices',
                icon: MegaphoneIcon,
                type: 'announcement',
            },
            {
                id: 'ch-2',
                name: 'General Chat',
                icon: HashIcon,
                type: 'general',
            },
            {
                id: 'ch-3',
                name: 'Kaizen Ideas',
                icon: LightbulbIcon,
                type: 'idea',
            },
            {
                id: 'ch-4',
                name: 'IT Support',
                icon: MessageSquareIcon,
                type: 'support',
            },
        ],
    },
    {
        id: 'c-eng',
        name: 'CSD- Engineering Dept',
        color: 'bg-orange-600',
        icon: 'E',
        banner: 'https://img.freepik.com/free-photo/industrial-design-software-3d-rendering_110488-500.jpg',
        channels: [
            {
                id: 'ch-5',
                name: 'Blueprints',
                icon: FileTextIcon,
                type: 'files',
            },
            {
                id: 'ch-6',
                name: 'RnD Discussion',
                icon: HashIcon,
                type: 'general',
            },
        ],
    },
]
export default function CommunitiesSidebar() {
    const [selectedCommunity, setSelectedCommunity] = useState<string | null>(
        null
    )
    const createCommunityModalDisclosure = useDisclosure({
        id: 'createCommunityModalDisclosure',
    })

    const createTopicModalDisclosure = useDisclosure({
        id: 'createTopicModalDisclosure',
    })

    const handleOpenTopicModal = (communityId: string) => {
        setSelectedCommunity(communityId)
        createTopicModalDisclosure.onOpen()
    }

    return (
        <div className="w-72 h-[calc(100vh-57px)] shrink-0 flex flex-col bg-background">
            {createCommunityModalDisclosure.isOpen && (
                <CreateCommunityModal
                    isOpen={createCommunityModalDisclosure.isOpen}
                    onClose={createCommunityModalDisclosure.onClose}
                />
            )}
            {createTopicModalDisclosure.isOpen && selectedCommunity && (
                <CreateTopicModal
                    isOpen={createTopicModalDisclosure.isOpen}
                    onClose={createTopicModalDisclosure.onClose}
                    communityId={selectedCommunity}
                    onSubmit={async () => {}}
                />
            )}
            <div className="p-4 flex items-center justify-between border-b border-border-default">
                <div />
                <div className="flex gap-1">
                    <Button isIconOnly size="sm" variant="light">
                        <SearchIcon size={18} />
                    </Button>
                    <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={createCommunityModalDisclosure.onOpen}
                    >
                        <PlusIcon size={18} />
                    </Button>
                </div>
            </div>
            <ScrollShadow className="flex-1 pt-2 pb-4">
                {COMMUNITIES.map((community) => (
                    <CommunitySection
                        community={community}
                        key={community.id}
                        onOpenTopicModal={handleOpenTopicModal}
                    />
                ))}
            </ScrollShadow>
        </div>
    )
}

function CommunitySection({
    community,
    onOpenTopicModal,
}: {
    community: any
    onOpenTopicModal: (communityId: string) => void
}) {
    const pathname = useRouterState({
        select: (state) => state.location.pathname,
    })

    return (
        <div key={community.id} className="mb-3">
            <div className="px-4 py-3 flex items-center justify-between hover:bg-background-hovered transition-colors duration-150 group">
                <div className="flex items-center gap-3">
                    <div
                        className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold text-white ${community.color}`}
                    >
                        {community.icon}
                    </div>
                    <span className="font-semibold text-text-default text-xs uppercase tracking-wider">
                        {community.name}
                    </span>
                </div>
                <Dropdown placement="bottom-end">
                    <DropdownTrigger>
                        <HeroButton
                            color="default"
                            size="xs"
                            className="size-4! p-0! flex transition duration-150"
                            isIconOnly
                            variant="light"
                        >
                            <EllipsisIcon size={14} />
                        </HeroButton>
                    </DropdownTrigger>
                    <DropdownMenu>
                        <DropdownItem
                            key="create_topic"
                            onPress={() => {
                                onOpenTopicModal(community.id)
                            }}
                        >
                            Create Topic
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
            <div className="flex flex-col">
                {community.channels.map((channel) => {
                    const Icon = channel.icon

                    const isActive = pathname === channel.id
                    return (
                        <button
                            key={channel.id}
                            className={`flex items-center gap-3 px-6 py-2 text-sm transition-all border-l-2
                        ${
                            isActive
                                ? 'border-primary bg-primary/10 text-white font-medium'
                                : 'border-transparent text-text-subdued hover:bg-background-hovered hover:text-text-default'
                        }
                      `}
                        >
                            <Icon
                                size={16}
                                className={
                                    isActive ? 'text-primary' : 'text-zinc-500'
                                }
                            />
                            <span>{channel.name}</span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
