import { ProjectAnalysis, ProjectManage, ProjectTimeline } from './shared'

export default function OverviewPage() {
    return (
        <div className="gap-2 h-full px-1 py-2 space-y-5">
            <ProjectAnalysis />
            <ProjectManage />
            <ProjectTimeline />
        </div>
    )
}
