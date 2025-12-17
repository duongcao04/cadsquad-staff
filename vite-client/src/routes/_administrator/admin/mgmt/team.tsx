import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_administrator/admin/mgmt/team')({
	component: ManageTeamPage,
})

function ManageTeamPage() {
	return <div></div>
}
