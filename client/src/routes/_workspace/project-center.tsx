import { PageHeading } from '@/shared/components'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_workspace/project-center')({
    component: ProjectCenterLayout,
})

function ProjectCenterLayout() {
    return (
        <>
            <PageHeading
                title="Project center"
                classNames={{
                    wrapper:
                        'w-full border-b border-border-default !py-3 pl-6 pr-3.5',
                }}
            />
            <div className="size-full pl-5 pr-3.5 pt-3">
                <Outlet />
            </div>
        </>
    )
}
