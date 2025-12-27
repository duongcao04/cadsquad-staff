import { optimizeCloudinary, useProfile } from '@/lib'
import { Avatar, Button, Textarea } from '@heroui/react'
import { ImageIcon, PaperclipIcon, SendIcon, SmileIcon } from 'lucide-react'
import { useState } from 'react'
import { TCommunity } from '../../../types'
import { HeroCard, HeroCardBody } from '../../ui/hero-card'

type CreatePostProps = { community: TCommunity }
export default function CreatePost({ community }: CreatePostProps) {
    const { profile } = useProfile()
    const [postContent, setPostContent] = useState('')

    return (
        <HeroCard className="bg-background border border-border-default">
            <HeroCardBody className="gap-4">
                <div className="flex items-start justify-start gap-3">
                    <Avatar
                        src={optimizeCloudinary(profile.avatar, {
                            width: 56,
                            height: 56,
                        })}
                        size="md"
                        classNames={{
                            img: 'size-10! aspect-square!',
                            base: 'size-10!',
                        }}
                    />
                    <Textarea
                        placeholder={`Share something with ${community.displayName}...`}
                        minRows={2}
                        variant="bordered"
                        classNames={{
                            inputWrapper:
                                'bg-background-muted border-border-default focus-within:border-primary',
                        }}
                        value={postContent}
                        onValueChange={setPostContent}
                    />
                </div>
                <div className="flex justify-between items-center pl-12">
                    <div className="flex gap-1">
                        <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            className="text-zinc-400 hover:text-primary"
                        >
                            <ImageIcon size={18} />
                        </Button>
                        <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            className="text-zinc-400 hover:text-primary"
                        >
                            <PaperclipIcon size={18} />
                        </Button>
                        <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            className="text-zinc-400 hover:text-primary"
                        >
                            <SmileIcon size={18} />
                        </Button>
                    </div>
                    <Button
                        size="sm"
                        color="primary"
                        isDisabled={!postContent}
                        endContent={<SendIcon size={16} />}
                    >
                        Post
                    </Button>
                </div>
            </HeroCardBody>
        </HeroCard>
    )
}
