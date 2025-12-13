import { Badge } from '@heroui/react'

import { PageHeading } from '..'

export default function ManageTeamHeading() {
    return (
        <PageHeading
            title={
                <Badge color="danger" content="5">
                    <p className="pr-5 leading-none">Team management</p>
                </Badge>
            }
            classNames={{
                wrapper: '!py-3 pl-6 pr-3.5',
            }}
        />
    )
}
