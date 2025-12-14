import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_workspace/profile')({
    component: ProfilePage,
})

function ProfilePage() {
    return <div></div>
}
