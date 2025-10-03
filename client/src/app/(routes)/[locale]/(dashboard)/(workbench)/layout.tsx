export default async function DashboardLayout({
    children,
    jobDetail,
}: {
    children: React.ReactNode
    jobDetail: React.ReactNode
}) {
    return (
        <>
            {jobDetail}
            {children}
        </>
    )
}
