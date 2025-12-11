import ManageTeamHeading from '@/shared/components/manage-team/ManageTeamHeading'

export default function ManageTeamLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="bg-background h-full flex flex-col">
            <div className="border-b border-border-default">
                <ManageTeamHeading />
            </div>
            <div>{children}</div>
        </div>
    )
}
