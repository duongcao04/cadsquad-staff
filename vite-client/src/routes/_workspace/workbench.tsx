import { createFileRoute } from '@tanstack/react-router'
import { PageHeading } from '../../shared/components'
import WorkbenchTableView from '../../shared/components/workbench/WorkbenchTableView'

export const Route = createFileRoute('/_workspace/workbench')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <WorkbenchLayout>
            <WorkbenchTableView />
        </WorkbenchLayout>
    )
}

function WorkbenchLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-background h-full flex flex-col">
            <div className="border-b border-border-default">
                <PageHeading
                    title="Workbench"
                    classNames={{
                        wrapper: '!py-3 pl-6 pr-3.5',
                    }}
                />
            </div>
            <div className="pl-5 pr-3.5 pt-5">{children}</div>
        </div>
    )
}
