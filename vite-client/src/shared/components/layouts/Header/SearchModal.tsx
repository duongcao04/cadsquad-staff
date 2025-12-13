'use client'

import { IMAGES, INTERNAL_URLS, WEB_PAGES } from '@/lib'
import { useSearchJobs } from '@/lib/queries/useJob'
import type { TJob } from '@/shared/types'
import { Divider, Kbd, Tab, Tabs } from '@heroui/react'
import { useRouter } from '@tanstack/react-router'
import { Image } from 'antd'
import {
    BriefcaseBusiness,
    ChevronRight,
    CodeXml,
    FileText,
    History,
    SearchIcon,
} from 'lucide-react'
import { useEffect, useMemo, useRef } from 'react'
import { useDebounceValue } from 'usehooks-ts'
import { HeroButton } from '../../ui/hero-button'
import { HeroCard, HeroCardBody, HeroCardHeader } from '../../ui/hero-card'
import { HeroInput } from '../../ui/hero-input'
import {
    HeroModal,
    HeroModalBody,
    HeroModalContent,
    HeroModalHeader,
} from '../../ui/hero-modal'
import { ScrollArea, ScrollBar } from '../../ui/scroll-area'

type SearchModalProps = {
    isOpen: boolean
    onClose: () => void
}
export function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const router = useRouter()
    const inputRef = useRef<HTMLInputElement | null>(null)

    const [inputValue, setInputValue] = useDebounceValue<string | undefined>(
        undefined,
        30
    )
    const { jobs } = useSearchJobs(inputValue)

    const webPageResult = useMemo(() => {
        // 1. Kiểm tra nếu không có input thì trả về rỗng (hoặc trả về all tùy logic của bạn)
        if (!inputValue) return []

        // 2. Chuyển input về chữ thường 1 lần để tối ưu
        const lowerInput = inputValue.toLowerCase().trim()

        return WEB_PAGES.filter((item) =>
            // 3. FIX: Item phải chứa Input (chứ không phải Input chứa Item)
            item.displayName.toLowerCase().includes(lowerInput)
        )
    }, [inputValue])

    const handleClose = () => {
        onClose()
        setInputValue(undefined)
    }

    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus()
        }
    }, [isOpen])

    return (
        <HeroModal
            isOpen={isOpen}
            onClose={handleClose}
            classNames={{
                base: 'max-w-[90%] sm:max-w-[80%] md:max-w-[60%] xl:max-w-[40%]',
            }}
            hideCloseButton
            placement="top"
        >
            <HeroModalContent>
                <HeroModalHeader>
                    <HeroInput
                        ref={inputRef}
                        className="mt-1"
                        placeholder="Search ..."
                        value={inputValue}
                        isClearable
                        onChange={(e) => {
                            const value = e.target.value
                            setInputValue(value)
                        }}
                        startContent={<SearchIcon />}
                        endContent={<Kbd>ESC</Kbd>}
                    />
                </HeroModalHeader>
                <Divider />
                <HeroModalBody className="px-0 py-4">
                    <Tabs
                        aria-label="Search modal tabs"
                        fullWidth
                        disabledKeys={['documents']}
                        classNames={{
                            base: 'px-4',
                        }}
                    >
                        <Tab
                            key="all"
                            title={
                                <div className="flex items-center justify-start gap-2">
                                    <History size={20} />
                                    <p className="font-medium text-text-7">
                                        All
                                        {jobs && webPageResult && (
                                            <span className="pl-1 text-sm text-text-subdued">
                                                (
                                                {jobs?.length +
                                                    webPageResult.length}
                                                )
                                            </span>
                                        )}
                                    </p>
                                </div>
                            }
                        >
                            {!inputValue && (
                                <p className="pb-8 mt-5 text-center text-text-subdued">
                                    Please enter search input least one
                                    character.
                                </p>
                            )}
                            {inputValue && (
                                <ScrollArea className="size-full min-h-[40vh] h-[70vh] pl-4 pr-2">
                                    <ScrollBar orientation="horizontal" />
                                    <ScrollBar orientation="vertical" />
                                    {jobs && jobs?.length > 0 && (
                                        <HeroCard className="p-0 border-none shadow-none">
                                            <HeroCardHeader className="py-0 px-2 rounded-none">
                                                <div className="flex items-center justify-start gap-4">
                                                    <p className="font-medium text-text-subdued text-nowrap">
                                                        Jobs
                                                        <span className="pl-2 font-semibold text-text-subdued">
                                                            ({jobs?.length})
                                                        </span>
                                                    </p>
                                                    <div className="bg-text-subdued h-px w-full" />
                                                </div>
                                            </HeroCardHeader>
                                            <HeroCardBody className="px-0 pb-5">
                                                {jobs?.map((job) => {
                                                    return (
                                                        <JobResultCard
                                                            key={job.id}
                                                            data={job}
                                                            onClick={(
                                                                jobNo
                                                            ) => {
                                                                router.navigate(
                                                                    {
                                                                        href: INTERNAL_URLS.getJobDetailUrl(
                                                                            jobNo
                                                                        ),
                                                                    }
                                                                )
                                                                handleClose()
                                                            }}
                                                        />
                                                    )
                                                })}
                                            </HeroCardBody>
                                        </HeroCard>
                                    )}
                                    <Divider className="mb-5" />
                                    {webPageResult &&
                                        webPageResult?.length > 0 && (
                                            <HeroCard className="p-0 border-none shadow-none">
                                                <HeroCardHeader className="py-0 px-2 rounded-none">
                                                    <div className="flex items-center justify-start gap-4">
                                                        <p className="font-medium text-text-subdued text-nowrap">
                                                            Internal pages
                                                            <span className="pl-2 font-semibold text-text-subdued">
                                                                (
                                                                {
                                                                    webPageResult?.length
                                                                }
                                                                )
                                                            </span>
                                                        </p>
                                                        <div className="bg-text-subdued h-px w-full" />
                                                    </div>
                                                </HeroCardHeader>
                                                <HeroCardBody className="px-0 pb-5">
                                                    {webPageResult?.map(
                                                        (page, idx) => {
                                                            return (
                                                                <InternalPageResultCard
                                                                    key={idx}
                                                                    icon={
                                                                        <page.icon
                                                                            size={
                                                                                32
                                                                            }
                                                                        />
                                                                    }
                                                                    title={
                                                                        page.displayName
                                                                    }
                                                                    url={
                                                                        page.url
                                                                    }
                                                                    onClick={
                                                                        handleClose
                                                                    }
                                                                />
                                                            )
                                                        }
                                                    )}
                                                </HeroCardBody>
                                            </HeroCard>
                                        )}
                                </ScrollArea>
                            )}
                        </Tab>
                        <Tab
                            key="job"
                            title={
                                <div className="flex items-center justify-start gap-2">
                                    <BriefcaseBusiness size={20} />
                                    <p className="font-medium text-text-7">
                                        Jobs
                                        {jobs && (
                                            <span className="pl-1 text-sm text-text-subdued">
                                                ({jobs?.length})
                                            </span>
                                        )}
                                    </p>
                                </div>
                            }
                        >
                            {!inputValue && (
                                <p className="pb-8 mt-5 text-center text-text-subdued">
                                    Please enter search input least one
                                    character.
                                </p>
                            )}
                            {inputValue && (
                                <ScrollArea className="size-full min-h-[40vh] h-[70vh] pl-4 pr-2">
                                    <ScrollBar orientation="horizontal" />
                                    <ScrollBar orientation="vertical" />
                                    {jobs && jobs?.length > 0 && (
                                        <HeroCard className="p-0 border-none shadow-none">
                                            <HeroCardHeader className="py-0 px-2 rounded-none">
                                                <div className="flex items-center justify-start gap-4">
                                                    <p className="font-medium text-text-subdued text-nowrap">
                                                        Jobs
                                                        <span className="pl-2 font-semibold text-text-subdued">
                                                            ({jobs?.length})
                                                        </span>
                                                    </p>
                                                    <div className="bg-text-subdued h-px w-full" />
                                                </div>
                                            </HeroCardHeader>
                                            <HeroCardBody className="px-0 pb-5">
                                                {jobs?.map((job) => {
                                                    return (
                                                        <JobResultCard
                                                            key={job.id}
                                                            data={job}
                                                            onClick={(
                                                                jobNo
                                                            ) => {
                                                                router.navigate(
                                                                    {
                                                                        href: INTERNAL_URLS.getJobDetailUrl(
                                                                            jobNo
                                                                        ),
                                                                    }
                                                                )
                                                                onClose()
                                                            }}
                                                        />
                                                    )
                                                })}
                                            </HeroCardBody>
                                        </HeroCard>
                                    )}
                                </ScrollArea>
                            )}
                        </Tab>
                        <Tab
                            key="documents"
                            title={
                                <div className="flex items-center justify-start gap-2">
                                    <FileText size={20} />
                                    <p className="font-medium text-text-7">
                                        Documents
                                    </p>
                                </div>
                            }
                        >
                            <div></div>
                        </Tab>
                        <Tab
                            key="others"
                            title={
                                <div className="flex items-center justify-start gap-2">
                                    <CodeXml size={20} />
                                    <p className="font-medium text-text-7">
                                        Others
                                        {webPageResult && (
                                            <span className="pl-1 text-sm text-text-subdued">
                                                ({webPageResult.length})
                                            </span>
                                        )}
                                    </p>
                                </div>
                            }
                        >
                            {!inputValue && (
                                <p className="pb-8 mt-5 text-center text-text-subdued">
                                    Please enter search input least one
                                    character.
                                </p>
                            )}
                            {inputValue && (
                                <ScrollArea className="size-full min-h-[40vh] h-[70vh] pl-4 pr-2">
                                    <ScrollBar orientation="horizontal" />
                                    <ScrollBar orientation="vertical" />
                                    {webPageResult &&
                                        webPageResult?.length > 0 && (
                                            <HeroCard className="p-0 border-none shadow-none">
                                                <HeroCardHeader className="py-0 px-2 rounded-none">
                                                    <div className="flex items-center justify-start gap-4">
                                                        <p className="font-medium text-text-subdued text-nowrap">
                                                            Internal pages
                                                            <span className="pl-2 font-semibold text-text-subdued">
                                                                (
                                                                {
                                                                    webPageResult?.length
                                                                }
                                                                )
                                                            </span>
                                                        </p>
                                                        <div className="bg-text-subdued h-px w-full" />
                                                    </div>
                                                </HeroCardHeader>
                                                <HeroCardBody className="px-0 pb-5">
                                                    {webPageResult?.map(
                                                        (page, idx) => {
                                                            return (
                                                                <InternalPageResultCard
                                                                    key={idx}
                                                                    icon={
                                                                        <page.icon
                                                                            size={
                                                                                32
                                                                            }
                                                                        />
                                                                    }
                                                                    title={
                                                                        page.displayName
                                                                    }
                                                                    url={
                                                                        page.url
                                                                    }
                                                                    onClick={
                                                                        handleClose
                                                                    }
                                                                />
                                                            )
                                                        }
                                                    )}
                                                </HeroCardBody>
                                            </HeroCard>
                                        )}
                                </ScrollArea>
                            )}
                        </Tab>
                    </Tabs>
                </HeroModalBody>
            </HeroModalContent>
        </HeroModal>
    )
}

function JobResultCard({
    data,
    onClick,
}: {
    data: TJob
    onClick: (jobNo: string) => void
}) {
    return (
        <button
            onClick={() => onClick(data.no)}
            className="bg-background-muted size-full rounded-md px-4 py-3 flex items-center justify-between hover:bg-primary hover:text-white transition duration-50 cursor-pointer"
        >
            <div className="flex items-center justify-start gap-3">
                <Image
                    src={data.status.thumbnailUrl ?? IMAGES.loadingPlaceholder}
                    alt={data.displayName}
                    rootClassName="size-12 rounded-full"
                    className="size-12 rounded-full"
                    preview={false}
                />
                <div className="space-y-0.5 text-left">
                    <p className="text-xs">#{data.no}</p>
                    <p className="text-sm font-medium">{data.displayName}</p>
                </div>
            </div>
            <ChevronRight size={16} />
        </button>
    )
}

function InternalPageResultCard({
    icon,
    title,
    description,
    url,
    onClick,
}: {
    icon: React.ReactNode
    title: string
    description?: string
    url: string
    onClick?: () => void
}) {
    const router = useRouter()
    return (
        <HeroButton
            className="flex items-center justify-start gap-2 w-full! h-18! hover:bg-primary! hover:text-white! border-none ring-none text-text-default! duration-150"
            startContent={
                <div className="size-12 flex items-center justify-center">
                    {icon}
                </div>
            }
            variant="light"
            endContent={<ChevronRight size={16} />}
            disableAnimation={true}
            onPress={() => {
                router.navigate({
                    href: url,
                })
                onClick?.()
            }}
        >
            <div className="w-full flex items-center justify-start gap-2">
                <span className="font-medium">{title}</span>
                {description}
            </div>
        </HeroButton>
    )
}
