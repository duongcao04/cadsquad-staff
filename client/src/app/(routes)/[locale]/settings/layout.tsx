import { Header } from '@/shared/components'
import { PersonalSettingSidebar } from '@/shared/components/layouts/settings-sidebar/PersonalSettingsSidebar'
import { AuthGuard } from '../../../../shared/guards'

export default async function SettingsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <AuthGuard>
            <div id="settings-page" className="h-screen w-screen">
                <div className="sticky top-0 w-full z-99 h-14">
                    <Header />
                </div>
                <main className="size-full h-[calc(100vh-56px)] max-h-[calc(100vh-56px)]">
                    <div className="size-full grid grid-cols-[300px_1px_1fr]">
                        <div className="sticky top-20 left-0 size-full overflow-hidden pt-4 bg-[#fafafa]! dark:bg-[#171717]!">
                            <PersonalSettingSidebar />
                        </div>
                        <div className="w-px h-full bg-text-disabled" />
                        <div className="size-full overflow-y-auto">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </AuthGuard>
    )
}
