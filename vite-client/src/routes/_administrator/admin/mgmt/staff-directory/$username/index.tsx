import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_administrator/admin/mgmt/staff-directory/$username/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>Hello "/_administrator/admin/mgmt/staff-directory/$username/"!</div>
  )
}
