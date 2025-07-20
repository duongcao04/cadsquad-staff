'use client'

import { Button, Tooltip } from '@heroui/react'

import { Link, usePathname } from '@/i18n/navigation'
import { type SidebarItem, appSidebar } from '@/shared/constants/appConstant'

export default function Sidebar() {
    return (
        <aside className="min-h-[calc(100vh-64px-80px)] w-fit bg-border rounded-full py-3 p-2 shadow-sm hover:shadow-2xl transition">
            <div className="flex flex-col gap-3">
                {appSidebar.map((item, index) => {
                    return <SidebarItem key={index} data={item} />
                })}
            </div>
        </aside>
    )
}

const SidebarItem = ({ data }: { data: SidebarItem }) => {
    const pathname = usePathname()

    const isCurrentPage = pathname === data.path

    return (
        <Tooltip content={data.title} placement="right">
            <Link href={data.path} className="block">
                <Button
                    variant={isCurrentPage ? 'solid' : 'light'}
                    className="rounded-full w-fit aspect-square"
                    isIconOnly
                    color={isCurrentPage ? 'primary' : 'default'}
                >
                    <data.icon size={20} />
                </Button>
            </Link>
        </Tooltip>
    )
}
