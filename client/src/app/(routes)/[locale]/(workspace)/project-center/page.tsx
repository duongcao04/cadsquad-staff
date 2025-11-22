import { permanentRedirect } from 'next/navigation'

export default function ProjectCenterPage() {
    // Default tab is PRIORITY
    return permanentRedirect('/project-center/priority')
}
