import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/mgmt/team')({
	component: ManageTeamPage,
})

function ManageTeamPage() {
	return <div></div>
}
