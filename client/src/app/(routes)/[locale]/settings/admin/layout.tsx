import React from 'react'
import { AdminSettingSidebar } from '../shared/components/SettingSidebar'

type Props = {
    children: React.ReactNode
}
export default function AdminSettingsLayout({ children }: Props) {
    return (
        <div className="size-full grid grid-cols-12 gap-1.5">
            <div className="col-span-2 overflow-hidden pt-4">
                <AdminSettingSidebar />
            </div>
            <div className="col-span-10 pr-3.5">{children}</div>
        </div>
    )
}
