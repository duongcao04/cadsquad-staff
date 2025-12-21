import { PageHeading } from '@/shared/components'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_workspace/project-center')({
    component: ProjectCenterLayout,
})

function ProjectCenterLayout() {
    return (
        <>
            <div className="border-b border-border-default">
                <PageHeading
                    title="Project center"
                    classNames={{
                        wrapper: '!py-3 pl-6 pr-3.5',
                    }}
                />
            </div>
            <div className="pl-5 pr-3.5 pt-3">
                <Outlet />
            </div>
        </>
    )
}
