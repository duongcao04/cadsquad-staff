import { PageHeading } from '@/shared/components'

type AppearanceSettingsLayoutProps = {
    children: React.ReactNode
}
export default function AppearanceSettingsLayout({
    children,
}: AppearanceSettingsLayoutProps) {
    return (
        <div className="bg-background h-full flex flex-col">
            <div className="border-b border-border-default">
                <PageHeading
                    title="Appearance"
                    description='Change how your public dashboard looks and feels'
                    classNames={{
                        wrapper: '!py-3 pl-6 pr-3.5',
                    }}
                />
            </div>
            <div className="pl-5 pr-3.5 pt-1">{children}</div>
        </div>
    )
}
