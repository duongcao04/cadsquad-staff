import React from 'react'
import { PersonalSettingSidebar } from '../shared/components/SettingSidebar'

type Props = {
    children: React.ReactNode
}
export default function PersonalSettingsLayout({ children }: Props) {
    return (
        <div className="size-full grid grid-cols-[300px_1fr] gap-10">
            <div className="size-full overflow-hidden pt-4">
                <PersonalSettingSidebar />
            </div>
            <div className="size-full">
                <div className="max-w-[900px]">{children}</div>
            </div>
        </div>
    )
}
