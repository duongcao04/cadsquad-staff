export default function layout({
    children,
    jobDetail,
    addMember,
}: {
    children: React.ReactNode
    jobDetail: React.ReactNode
    addMember: React.ReactNode
}) {
    return (
        <div className="size-full">
            {children}
            {jobDetail}
            {addMember}
        </div>
    )
}
