import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from '@/shared/components/ui/context-menu'
import { useStore } from '@tanstack/react-store'
import {
    CircleCheck,
    CircleDollarSign,
    PinIcon,
    SquareArrowOutUpRight,
    Trash,
    UserPlus,
} from 'lucide-react'
import React, { useEffect } from 'react'
import { useLocale } from 'next-intl'
import { pCenterTableStore } from '../../stores'

type Props = { children: React.ReactNode }

export default function TableContextMenu({ children }: Props) {
    const locale = useLocale()

    useEffect(() => {
        // Define the event handler
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handleContextMenu = (e: any) => {
            e.preventDefault()
        }

        // Add the event listener to the document
        document.addEventListener('contextmenu', handleContextMenu)

        // Remove the event listener on component unmount
        return () => {
            document.removeEventListener('contextmenu', handleContextMenu)
        }
    }, [])

    const contextItem = useStore(
        pCenterTableStore,
        (state) => state.contextItem
    )

    const onOpenNewTab = () =>
        window.open(`/${locale}/jobs/${contextItem?.no}`, '_blank')

    return (
        <ContextMenu>
            <ContextMenuTrigger>{children}</ContextMenuTrigger>
            <ContextMenuContent
                className="bg-background-muted w-[200px]"
                style={{ zIndex: 99999 }}
            >
                <ContextMenuItem
                    disabled={!Boolean(contextItem)}
                    onClick={onOpenNewTab}
                    className="cursor-pointer"
                >
                    <SquareArrowOutUpRight size={12} />
                    Open in new tab
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem disabled={!Boolean(contextItem)}>
                    <PinIcon
                        size={14}
                        className="text-text-subdued rotate-45"
                    />
                    Pin Job
                </ContextMenuItem>
                <ContextMenuItem disabled={!Boolean(contextItem)}>
                    <UserPlus size={14} className="text-text-subdued" />
                    Assign / Reassign
                </ContextMenuItem>
                <ContextMenuItem disabled={!Boolean(contextItem)}>
                    <Trash size={14} className="text-text-subdued" />
                    Delete
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem disabled={!Boolean(contextItem)}>
                    <CircleDollarSign size={14} className="text-text-subdued" />
                    Update Cost
                </ContextMenuItem>
                <ContextMenuItem disabled={!Boolean(contextItem)}>
                    <CircleCheck size={14} className="text-text-subdued" />
                    Mark as Paid
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )
}
