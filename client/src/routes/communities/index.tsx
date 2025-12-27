import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/communities/')({
    component: Test,
})
function Test(){
    return <div>a</div>
}

