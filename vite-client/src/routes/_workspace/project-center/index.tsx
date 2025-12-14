import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_workspace/project-center/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_workspace/project-center/"!</div>
}
