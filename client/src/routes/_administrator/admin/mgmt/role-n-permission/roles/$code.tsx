import { createFileRoute } from '@tanstack/react-router'
import {
    Button,
    CheckboxGroup,
    Checkbox,
    Divider,
    Breadcrumbs,
    BreadcrumbItem,
} from '@heroui/react'
import { Save, ArrowLeft } from 'lucide-react'

export const Route = createFileRoute(
    '/_administrator/admin/mgmt/role-n-permission/roles/$code'
)({
    component: RoleDetailPage,
})

export default function RoleDetailPage() {
    const { code } = Route.useParams()

    return (
        <div className="p-6 space-y-6">
            <Breadcrumbs>
                <BreadcrumbItem href="/admin/mgmt/role-n-permission/roles">
                    Roles
                </BreadcrumbItem>
                <BreadcrumbItem className="capitalize">{code}</BreadcrumbItem>
            </Breadcrumbs>

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold capitalize">
                        {code} Permissions
                    </h1>
                    <p className="text-small text-default-500">
                        Fine-tune what this role can and cannot do.
                    </p>
                </div>
                <Button
                    color="primary"
                    startContent={<Save size={18} />}
                    className="font-bold"
                >
                    Save Changes
                </Button>
            </div>

            <Divider />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                {['Community', 'Post', 'Topic', 'Comment'].map((entity) => (
                    <div
                        key={entity}
                        className="bg-content1 p-6 rounded-2xl border border-divider shadow-sm"
                    >
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-primary rounded-full" />
                            {entity} Management
                        </h3>
                        <CheckboxGroup color="primary" defaultValue={['read']}>
                            <div className="grid grid-cols-2 gap-4">
                                <Checkbox value="create">
                                    Create {entity}
                                </Checkbox>
                                <Checkbox value="read">View/Read</Checkbox>
                                <Checkbox value="update">Update/Edit</Checkbox>
                                <Checkbox value="delete">
                                    Delete/Remove
                                </Checkbox>
                                <Checkbox value="moderate">
                                    Moderate content
                                </Checkbox>
                                <Checkbox value="lock">Lock/Pin</Checkbox>
                            </div>
                        </CheckboxGroup>
                    </div>
                ))}
            </div>
        </div>
    )
}
