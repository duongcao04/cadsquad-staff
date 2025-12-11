import { PageHeading } from '@/shared/components'

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="bg-background h-full flex flex-col">
            <div className="border-b border-border-default">
                <PageHeading
                    title="Profile"
                    classNames={{
                        wrapper: '!py-3 pl-6 pr-3.5',
                    }}
                />
            </div>
            <div className="pl-5 pr-3.5 pt-1">{children}</div>
        </div>
    )
}
