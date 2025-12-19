import { INTERNAL_URLS, useProfile } from '@/lib'
import { CHANNELS } from '@/lib/ably'
import { Button, Kbd, useDisclosure } from '@heroui/react'
import { useRouter } from '@tanstack/react-router'
import { ChannelProvider } from 'ably/react'
import { Layout } from 'antd'
import hotkeys from 'hotkeys-js'
import { CircleHelpIcon, Search } from 'lucide-react'
import { useEffect } from 'react'
import CadsquadLogo from '../../CadsquadLogo'
import { HeroButton } from '../../ui/hero-button'
import NotificationDropdown from './NotificationDropdown'
import { SearchModal } from './SearchModal'
import { SettingsDropdown } from './SettingsDropdown'
import { UserDropdown } from './UserDropdown'

const { Header: AntHeader } = Layout

export const Header = () => {
    const router = useRouter()
    const { profile } = useProfile()
    const { isOpen, onClose, onOpen } = useDisclosure({
        id: 'SearchModal',
    })

    useEffect(() => {
        hotkeys('ctrl+k', function (event) {
            // Prevent the default refresh event under WINDOWS system
            event.preventDefault()
            onOpen()
        })
    }, [])

    return (
        <AntHeader
            style={{
                background: 'var(--background)',
                padding: 0,
                overflow: 'hidden',
                height: '56px',
            }}
            className="border-b border-border-muted"
        >
            {/* Logo */}
            <div className="h-full container grid grid-cols-[130px_1fr_220px] gap-5 items-center">
                <CadsquadLogo
                    classNames={{
                        logo: 'h-8',
                    }}
                />
                <div className="w-full">
                    <div className="w-full flex items-center justify-center">
                        <HeroButton
                            variant="bordered"
                            className="rounded-full! border-border-default border-1 placeholder-text-subdued"
                            color="default"
                            onPress={onOpen}
                            startContent={
                                <Search
                                    size={16}
                                    className="text-text-subdued"
                                />
                            }
                            endContent={
                                <Kbd
                                    onKeyDown={() => {
                                        onOpen()
                                    }}
                                    classNames={{
                                        base: 'opacity-85',
                                    }}
                                >
                                    Ctrl + K
                                </Kbd>
                            }
                        >
                            <div className="w-96 text-text-7 tracking-wide">
                                Search
                            </div>
                        </HeroButton>
                    </div>
                    {isOpen && (
                        <SearchModal isOpen={isOpen} onClose={onClose} />
                    )}
                </div>

                <div className="h-full flex justify-end items-center gap-3">
                    <div className="flex items-center justify-end gap-3">
                        {profile.id && (
                            <ChannelProvider
                                channelName={CHANNELS.userNotificationsKey(
                                    profile.id
                                )}
                            >
                                <NotificationDropdown />
                            </ChannelProvider>
                        )}
                        <Button
                            variant="light"
                            startContent={<CircleHelpIcon size={18} />}
                            size="sm"
                            isIconOnly
                            onPress={() => {
                                router.navigate({
                                    href: INTERNAL_URLS.helpCenter,
                                })
                            }}
                        />
                        <SettingsDropdown />
                    </div>

                    <div className="h-[50%] w-[1.5px] bg-border ml-1.5 mr-3" />

                    <UserDropdown />
                </div>
            </div>
        </AntHeader>
    )
}
