export default async function DashboardLayout({
    children,
    jobDetail,
    addMember,
}: {
    children: React.ReactNode
    jobDetail: React.ReactNode
    addMember: React.ReactNode
}) {
    return (
        <>
            {jobDetail}
            {addMember}
            {children}
        </>
    )
}
