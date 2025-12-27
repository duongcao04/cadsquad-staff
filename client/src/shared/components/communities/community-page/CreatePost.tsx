import { optimizeCloudinary, useProfile } from '@/lib'
import { Avatar, Button, Textarea } from '@heroui/react'
import {
    ImageIcon,
    PaperclipIcon,
    SendIcon,
    SmileIcon,
    XIcon,
} from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { TCommunity } from '../../../types'
import { HeroCard, HeroCardBody } from '../../ui/hero-card'
import QuillEditor from '../../editor-quill/QuillEditor'
import { motion, AnimatePresence } from 'framer-motion'

type CreatePostProps = { community: TCommunity }

// Crisp transition for width only
const transition = { type: 'spring', bounce: 0, duration: 0.4 }

export default function CreatePost({ community }: CreatePostProps) {
    const { profile } = useProfile()
    const [postContent, setPostContent] = useState('')
    const [isActive, setIsActive] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node) &&
                !postContent
            ) {
                setIsActive(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () =>
            document.removeEventListener('mousedown', handleClickOutside)
    }, [postContent])

    return (
        <div ref={containerRef}>
            <HeroCard
                as={motion.div}
                // Removed 'layout' prop to prevent height/position morphing
                initial={false}
                animate={{
                    width: isActive ? '100%' : '896px',
                }}
                transition={transition}
                className="bg-background mx-auto border border-border-default overflow-hidden"
            >
                <HeroCardBody className="gap-4">
                    <div
                        className={
                            !isActive
                                ? 'flex items-start justify-start gap-3'
                                : ''
                        }
                    >
                        {/* Static Avatar Wrapper */}
                        <div className="shrink-0 flex items-center mb-4 gap-3">
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
                            <p className="text-sm font-semibold">
                                {profile.displayName}
                            </p>
                        </div>

                        {/* Content Area - Opacity Only, No Layout Shift */}
                        <div className="flex-1 w-full min-w-0">
                            {isActive ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <QuillEditor
                                        value={postContent}
                                        onChange={setPostContent}
                                    />
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="w-full"
                                >
                                    <Textarea
                                        placeholder={`Share something with ${community.displayName}...`}
                                        minRows={2}
                                        variant="bordered"
                                        onFocus={() => setIsActive(true)}
                                        classNames={{
                                            inputWrapper:
                                                'bg-background-muted border-border-default focus-within:border-primary',
                                        }}
                                        value={postContent}
                                        onValueChange={setPostContent}
                                    />
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* Toolbar - Opacity Only (No height animation) */}
                    <AnimatePresence>
                        {isActive && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="flex justify-between items-center pl-12"
                            >
                                <div className="flex gap-1 py-1">
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
                                <div className="flex items-center justify-end gap-2 py-1">
                                    <Button
                                        size="sm"
                                        color="danger"
                                        variant="flat"
                                        isDisabled={!postContent}
                                        startContent={<XIcon size={16} />}
                                        onPress={() => setIsActive(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        size="sm"
                                        color="primary"
                                        isDisabled={!postContent}
                                        endContent={<SendIcon size={16} />}
                                    >
                                        Post
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </HeroCardBody>
            </HeroCard>
        </div>
    )
}
