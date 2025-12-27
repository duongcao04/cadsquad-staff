import { dateFormatter, optimizeCloudinary } from '@/lib'
import {
    communitiesPostsListOptions,
    communityOptions,
} from '@/lib/queries/options/community-queries'
import {
    HeroButton,
    HeroCard,
    HeroCardBody,
    HeroCardFooter,
    HeroCardHeader,
} from '@/shared/components'
import CreatePost from '@/shared/components/communities/community-page/CreatePost'
import { communitiesStore } from '@/shared/stores/_communities.store'
import { TCommunity, TPost } from '@/shared/types'
import {
    Avatar,
    AvatarGroup,
    Button,
    Card,
    CardFooter,
    Chip,
    Divider,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    ScrollShadow,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Tabs,
    useDisclosure,
} from '@heroui/react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useStore } from '@tanstack/react-store'
import { Image } from 'antd'
import {
    ArrowRightIcon,
    BellIcon,
    CalendarIcon,
    CircleAlertIcon,
    DownloadIcon,
    FileSpreadsheetIcon,
    FileTextIcon,
    FilterIcon,
    HeartIcon,
    MessageCircleIcon,
    MoreHorizontalIcon,
    PlusIcon,
    ShareIcon,
} from 'lucide-react'
import { useState } from 'react'

export const MOCK_FILES = [
    {
        id: 'f-1',
        name: 'Q4_Sales_Report.xlsx',
        type: 'EXCEL',
        size: '2.4 MB',
        author: 'Alice Manager',
        date: 'Oct 24',
    },
    {
        id: 'f-2',
        name: 'Brand_Guidelines_V2.pdf',
        type: 'PDF',
        size: '14 MB',
        author: 'Marketing Team',
        date: 'Oct 22',
    },
    {
        id: 'f-3',
        name: 'Project_X_Specs.docx',
        type: 'DOC',
        size: '850 KB',
        author: 'Bob Engineer',
        date: 'Oct 20',
    },
    {
        id: 'f-4',
        name: 'Meeting_Minutes_Oct.txt',
        type: 'TEXT',
        size: '12 KB',
        author: 'Sarah Admin',
        date: 'Oct 18',
    },
]

export const MOCK_PHOTOS = [
    {
        id: 'img-1',
        src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c',
        caption: 'Team Building 2024',
    },
    {
        id: 'img-2',
        src: 'https://images.unsplash.com/photo-1551434678-e076c223a692',
        caption: 'New Warehouse Opening',
    },
    {
        id: 'img-3',
        src: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0',
        caption: 'Strategy Meeting',
    },
    {
        id: 'img-4',
        src: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952',
        caption: 'Q3 Awards',
    },
]

export const UPCOMING_EVENTS = [
    {
        id: 'ev-1',
        title: 'Q4 Strategy Kickoff',
        date: 'Mon, Oct 28 • 10:00 AM',
        location: 'Meeting Room A',
    },
    {
        id: 'ev-2',
        title: 'Happy Hour',
        date: 'Fri, Nov 01 • 5:00 PM',
        location: 'Lounge Area',
    },
]

export const MOCK_POSTS = [
    {
        id: 'p-1',
        author: {
            name: 'Alice Manager',
            avatar: 'https://i.pravatar.cc/150?u=1',
            role: 'Sales Director',
        },
        content:
            'Reminder: The Q4 strategy kickoff is happening this Monday. Please review the attached pre-read materials.',
        timestamp: '2 hours ago',
        likes: 24,
        comments: 5,
        isAnnouncement: true,
        hasEvent: true, // Special styling
        eventId: 'ev-1',
    },
    {
        id: 'p-2',
        author: {
            name: 'Bob Engineer',
            avatar: 'https://i.pravatar.cc/150?u=2',
            role: 'Senior Dev',
        },
        content:
            "Does anyone have access to the old CAD server? I'm getting a timeout error.",
        timestamp: '5 hours ago',
        likes: 2,
        comments: 12,
        isAnnouncement: false,
    },
]

export const Route = createFileRoute('/communities/$code/')({
    loader({ context, params }) {
        const { code } = params
        void context.queryClient.ensureQueryData({
            ...communitiesPostsListOptions(code),
        })
        return context.queryClient.ensureQueryData({
            ...communityOptions(code),
        })
    },
    component: CommunityPage,
})

export default function CommunityPage() {
    const { code } = Route.useParams()
    const { data: community } = useSuspenseQuery({
        ...communityOptions(code),
    })
    const { data: posts } = useSuspenseQuery({
        ...communitiesPostsListOptions(code),
    })

    const detailPanelDisclosure = useDisclosure({
        id: 'detailPanelDisclosure',
    })
    const [activeTab, setActiveTab] = useState('posts')

    const isWritingPost = useStore(
        communitiesStore,
        (state) => state.isWritingPost
    )

    // --- SUB-COMPONENTS ---

    // 1. FILES VIEW
    const FilesView = () => (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Documents</h3>
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant="flat"
                        startContent={<FilterIcon size={16} />}
                    >
                        Filter
                    </Button>
                    <Button
                        size="sm"
                        color="primary"
                        startContent={<PlusIcon size={16} />}
                    >
                        Upload
                    </Button>
                </div>
            </div>
            <Table
                aria-label="Files table"
                classNames={{
                    base: 'bg-zinc-900',
                    th: 'bg-zinc-800 text-zinc-400',
                    td: 'text-zinc-300',
                    wrapper: 'bg-zinc-900 border border-zinc-800 p-0',
                }}
            >
                <TableHeader>
                    <TableColumn>NAME</TableColumn>
                    <TableColumn>TYPE</TableColumn>
                    <TableColumn>SIZE</TableColumn>
                    <TableColumn>AUTHOR</TableColumn>
                    <TableColumn>ACTIONS</TableColumn>
                </TableHeader>
                <TableBody>
                    {MOCK_FILES.map((file) => (
                        <TableRow
                            key={file.id}
                            className="hover:bg-zinc-800/50 cursor-pointer transition-colors"
                        >
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-zinc-800 rounded text-zinc-400">
                                        {file.type === 'EXCEL' ? (
                                            <FileSpreadsheetIcon
                                                size={18}
                                                className="text-green-500"
                                            />
                                        ) : file.type === 'PDF' ? (
                                            <FileTextIcon
                                                size={18}
                                                className="text-red-500"
                                            />
                                        ) : (
                                            <FileTextIcon size={18} />
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-zinc-200">
                                            {file.name}
                                        </span>
                                        <span className="text-xs text-zinc-500">
                                            {file.date}
                                        </span>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Chip
                                    size="sm"
                                    variant="flat"
                                    className="text-xs"
                                >
                                    {file.type}
                                </Chip>
                            </TableCell>
                            <TableCell>{file.size}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Avatar
                                        size="sm"
                                        src={`https://i.pravatar.cc/150?u=${file.author}`}
                                    />
                                    <span>{file.author}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Button isIconOnly size="sm" variant="light">
                                    <DownloadIcon
                                        size={16}
                                        className="text-zinc-500"
                                    />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )

    // 2. PHOTOS VIEW
    const PhotosView = () => (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Gallery</h3>
                <Button
                    size="sm"
                    color="primary"
                    startContent={<PlusIcon size={16} />}
                >
                    Add Photo
                </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {MOCK_PHOTOS.map((photo) => (
                    <Card key={photo.id} isPressable className="border-none">
                        <Image
                            removeWrapper
                            alt={photo.caption}
                            className="z-0 w-full h-full object-cover aspect-square hover:scale-110 transition-transform duration-300"
                            src={photo.src}
                        />
                        <CardFooter className="absolute bg-black/40 bottom-0 border-t-1 border-zinc-100/10 z-10 justify-between">
                            <p className="text-tiny text-white/90">
                                {photo.caption}
                            </p>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )

    // 3. POSTS VIEW (Feed)

    return (
        <div className="size-full">
            {/* --- CENTER CONTENT --- */}
            <div className="size-full">
                {!isWritingPost && (
                    <Image
                        src={community.banner}
                        alt="Banner"
                        rootClassName="px-3 pt-3 w-full aspect-[1740/400] object-cover overflow-hidden rounded-xl"
                        className="size-full rounded-xl"
                        preview={false}
                    />
                )}
                <div className="px-7 pt-3 pb-4 w-full flex items-center justify-between">
                    <div className="flex items-center justify-start gap-3">
                        <Image
                            src={optimizeCloudinary(community.icon, {
                                width: 512,
                                height: 512,
                            })}
                            rootClassName="size-10"
                            className="rounded-md"
                            preview={false}
                        />
                        <h1 className="text-lg font-bold text-text-default">
                            {community.displayName}
                        </h1>
                        <Tabs
                            selectedKey={activeTab}
                            onSelectionChange={(k) => setActiveTab(k as string)}
                            variant="underlined"
                            color="primary"
                            classNames={{
                                base: 'ml-1',
                                tabContent:
                                    'group-data-[selected=true]:text-text-default group-data-[selected=true]:font-semibold font-medium',
                            }}
                        >
                            <Tab key="posts" title="Posts" />
                            <Tab key="files" title="Files" />
                            <Tab key="photos" title="Photos" />
                            <Tab key="members" title="Members" />
                        </Tabs>
                    </div>
                    <div className="flex gap-3">
                        <Button size="sm" color="primary">
                            Invite
                        </Button>
                        <Button
                            size="sm"
                            variant="flat"
                            startContent={<BellIcon size={16} />}
                        >
                            Notifications
                        </Button>
                        <Button
                            size="sm"
                            variant="flat"
                            onPress={detailPanelDisclosure.onOpen}
                            isIconOnly
                        >
                            <CircleAlertIcon size={16} />
                        </Button>
                    </div>
                </div>
            </div>
            <Divider />
            {/* Scrollable Main Area */}
            <ScrollShadow className="flex-1">
                {activeTab === 'posts' && (
                    <PostsView community={community} posts={posts} />
                )}
                {activeTab === 'files' && <FilesView />}
                {activeTab === 'photos' && <PhotosView />}
            </ScrollShadow>

            {/* --- RIGHT SIDEBAR (Events & Info) --- */}
            {detailPanelDisclosure.isOpen && (
                <ChannelDetails onClose={detailPanelDisclosure.onClose} />
            )}
        </div>
    )
}
type ChannelDetailsProps = {
    onClose: () => void
}
function ChannelDetails({ onClose }: ChannelDetailsProps) {
    return (
        <div className="bg-background-muted w-80 shrink-0 border-l border-border-default py-5 px-4 hidden xl:flex flex-col gap-8">
            {/* About Section */}
            <div>
                <div className="flex items-center justify-start gap-2 mb-3">
                    <HeroButton
                        onPress={onClose}
                        isIconOnly
                        variant="light"
                        size="sm"
                        color="default"
                    >
                        <ArrowRightIcon size={16} />
                    </HeroButton>
                    <h3 className="pt-0.5 text-sm font-bold text-text-default uppercase tracking-wider">
                        About Channel
                    </h3>
                </div>
                <p className="text-sm text-text-subdued leading-relaxed">
                    Official communication channel for the Sales & Marketing
                    department. Please keep discussions relevant to quarterly
                    targets and brand campaigns.
                </p>
            </div>

            {/* Upcoming Events */}
            <div>
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-bold text-text-default uppercase tracking-wider">
                        Upcoming Events
                    </h3>
                    <Button isIconOnly size="sm" variant="light">
                        <PlusIcon size={14} />
                    </Button>
                </div>
                <div className="space-y-3">
                    {UPCOMING_EVENTS.map((evt) => (
                        <HeroCard
                            key={evt.id}
                            className="bg-background border border-border-default"
                        >
                            <HeroCardBody className="p-3 flex gap-3 items-center">
                                <div className="bg-background-hovered p-2 rounded text-text-default">
                                    <CalendarIcon size={20} />
                                </div>
                                <div className="flex flex-col overflow-hidden">
                                    <span className="text-sm font-semibold truncate text-text-default">
                                        {evt.title}
                                    </span>
                                    <span className="text-xs text-text-subdued truncate">
                                        {evt.date}
                                    </span>
                                </div>
                            </HeroCardBody>
                        </HeroCard>
                    ))}
                </div>
            </div>

            {/* Online Members */}
            <div>
                <h3 className="text-sm font-bold text-text-default uppercase tracking-wider mb-3">
                    Online - 12
                </h3>
                <div className="flex flex-wrap gap-2">
                    <AvatarGroup max={6} size="sm" isBordered>
                        <Avatar src="https://i.pravatar.cc/150?u=1" />
                        <Avatar src="https://i.pravatar.cc/150?u=2" />
                        <Avatar src="https://i.pravatar.cc/150?u=3" />
                        <Avatar src="https://i.pravatar.cc/150?u=4" />
                        <Avatar src="https://i.pravatar.cc/150?u=5" />
                        <Avatar src="https://i.pravatar.cc/150?u=6" />
                        <Avatar src="https://i.pravatar.cc/150?u=7" />
                    </AvatarGroup>
                </div>
            </div>
        </div>
    )
}

type PostsViewProps = {
    community: TCommunity
    posts: TPost[]
}
const PostsView = ({ community, posts }: PostsViewProps) => {
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())

    const isWritingPost = useStore(
        communitiesStore,
        (state) => state.isWritingPost
    )

    const toggleLike = (id: string) => {
        const next = new Set(likedPosts)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        setLikedPosts(next)
    }

    return (
        <div className="p-6 size-full space-y-6">
            {/* <CreatePost community={community} /> */}
            {/* Feed */}
            {!isWritingPost && (
                <div className="max-w-4xl mx-auto">
                    {posts.map((post) => (
                        <HeroCard
                            key={post.id}
                            className="bg-background border border-border-default"
                        >
                            <HeroCardHeader className="justify-between items-start pb-0">
                                <div className="flex gap-3">
                                    <Avatar
                                        src={optimizeCloudinary(
                                            post.author.avatar,
                                            {
                                                width: 56,
                                                height: 56,
                                            }
                                        )}
                                    />
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-small font-semibold text-text-default">
                                                {post.author.displayName}
                                            </h4>
                                            {post.isPinned && (
                                                <Chip
                                                    size="sm"
                                                    color="warning"
                                                    variant="flat"
                                                    className="h-5 px-1 text-[10px]"
                                                >
                                                    Announcement
                                                </Chip>
                                            )}
                                        </div>
                                        <span className="text-tiny text-text-subdued">
                                            {post.author.role} •{' '}
                                            {dateFormatter(post.createdAt)}
                                        </span>
                                    </div>
                                </div>
                                <Dropdown>
                                    <DropdownTrigger>
                                        <Button
                                            isIconOnly
                                            variant="light"
                                            size="sm"
                                            className="text-zinc-500"
                                        >
                                            <MoreHorizontalIcon size={18} />
                                        </Button>
                                    </DropdownTrigger>
                                    <DropdownMenu
                                        variant="faded"
                                        aria-label="Post Actions"
                                    >
                                        <DropdownItem key="save">
                                            Save Post
                                        </DropdownItem>
                                        <DropdownItem key="mute">
                                            Mute Notifications
                                        </DropdownItem>
                                        <DropdownItem
                                            key="report"
                                            className="text-danger"
                                            color="danger"
                                        >
                                            Report
                                        </DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </HeroCardHeader>

                            <HeroCardBody className="py-4 text-text-default gap-3">
                                <p>{post.content}</p>
                                {/* Event Attachment HeroCard */}
                                {post.hasEvent && (
                                    <div className="flex gap-4 p-3 rounded-lg bg-background-muted border border-border-default cursor-pointer hover:border-primary transition-colors">
                                        <div className="w-12 h-12 rounded-lg bg-red-900/30 text-red-500 flex flex-col items-center justify-center border border-red-900/50">
                                            <span className="text-[10px] font-bold uppercase">
                                                OCT
                                            </span>
                                            <span className="text-lg font-bold leading-none">
                                                28
                                            </span>
                                        </div>
                                        <div className="flex flex-col justify-center">
                                            <span className="font-bold text-text-default">
                                                Q4 Strategy Kickoff
                                            </span>
                                            <span className="text-xs text-text-subdued">
                                                Mon • 10:00 AM • Meeting Room A
                                            </span>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="flat"
                                            className="ml-auto self-center"
                                        >
                                            RSVP
                                        </Button>
                                    </div>
                                )}
                            </HeroCardBody>

                            <Divider />

                            <HeroCardFooter className="gap-6 pt-3">
                                <button
                                    onClick={() => toggleLike(post.id)}
                                    className={`cursor-pointer flex items-center gap-2 text-small transition-colors ${likedPosts.has(post.id) ? `text-pink-500` : `text-text-default/80 hover:text-text-subdued`}`}
                                >
                                    <HeartIcon
                                        size={18}
                                        fill={
                                            likedPosts.has(post.id)
                                                ? 'currentColor'
                                                : 'none'
                                        }
                                    />
                                    <span>
                                        {post.likes +
                                            (likedPosts.has(post.id) ? 1 : 0)}
                                    </span>
                                </button>
                                <button className="cursor-pointer flex items-center gap-2 text-text-default/80 hover:text-blue-500 transition-colors text-small">
                                    <MessageCircleIcon size={18} />
                                    <span>{post.comments} Comments</span>
                                </button>
                                <button className="cursor-pointer flex items-center gap-2 text-text-default/80 hover:text-zinc-200 transition-colors text-small ml-auto">
                                    <ShareIcon size={18} />
                                    <span>Share</span>
                                </button>
                            </HeroCardFooter>
                        </HeroCard>
                    ))}
                </div>
            )}
        </div>
    )
}
