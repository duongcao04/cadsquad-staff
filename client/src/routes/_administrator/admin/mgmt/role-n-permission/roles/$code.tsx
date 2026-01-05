import {
    Button,
    Checkbox,
    CheckboxGroup,
    Divider,
    Accordion,
    AccordionItem,
    Chip,
} from '@heroui/react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import {
    Save,
    ShieldCheck,
    LayoutDashboard,
    MessageSquare,
    BookOpen,
    Users,
} from 'lucide-react'
import { permissionGroupsListOptions } from '../../../../../../lib/queries'

export const Route = createFileRoute(
    '/_administrator/admin/mgmt/role-n-permission/roles/$code'
)({
    component: RoleDetailPage,
})

export default function RoleDetailPage() {
    const { data: permissionGroups } = useSuspenseQuery({
        ...permissionGroupsListOptions(),
    })
    const { code } = Route.useParams()

    // Icon mapping for entities to make the Accordion more visual
    const iconMap: Record<string, React.ReactNode> = {
        Community: <Users size={20} className="text-primary" />,
        Post: <LayoutDashboard size={20} className="text-primary" />,
        Topic: <BookOpen size={20} className="text-primary" />,
        Comment: <MessageSquare size={20} className="text-primary" />,
    }

    return (
        <div className="p-6 space-y-6 animate-in fade-in duration-500">
            {/* --- Header Area --- */}
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold capitalize">
                            {code} Permissions
                        </h1>
                        <Chip
                            size="sm"
                            variant="flat"
                            color="primary"
                            className="font-bold"
                        >
                            Role Template
                        </Chip>
                    </div>
                    <p className="text-small text-default-500">
                        Granularly control what the <b>{code}</b> role can
                        access and modify.
                    </p>
                </div>
                <Button
                    color="primary"
                    startContent={<Save size={18} />}
                    className="font-bold shadow-lg shadow-primary/20"
                    size="lg"
                >
                    Save Changes
                </Button>
            </div>

            <Divider />

            {/* --- Accordion Permissions Matrix --- */}
            <div className="max-w-4xl mx-auto pt-4">
                <Accordion
                    variant="splitted"
                    selectionMode="multiple"
                    defaultExpandedKeys={['Post']}
                    className="px-0"
                >
                    {permissionGroups.map((gr) => (
                        <AccordionItem
                            key={gr.id}
                            aria-label={gr.name}
                            title={
                                <span className="font-bold text-lg">
                                    {gr.name}
                                </span>
                            }
                            subtitle={`Configure access for ${gr.name.toLowerCase()} actions`}
                            classNames={{
                                base: 'border border-divider shadow-sm mb-4',
                                titleWrapper: 'cursor-pointer',
                                content: 'pb-6 px-4',
                            }}
                        >
                            <Divider className="my-4" />
                            <CheckboxGroup
                                color="primary"
                                defaultValue={['read']}
                                orientation="horizontal"
                                className="gap-6"
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-12">
                                    <PermissionCheckbox
                                        value="create"
                                        label={`Create ${gr.name}`}
                                    />
                                    <PermissionCheckbox
                                        value="read"
                                        label="View/Read"
                                    />
                                    <PermissionCheckbox
                                        value="update"
                                        label="Update/Edit"
                                    />
                                    <PermissionCheckbox
                                        value="delete"
                                        label="Delete/Remove"
                                    />
                                    <PermissionCheckbox
                                        value="moderate"
                                        label="Moderate Content"
                                    />
                                    <PermissionCheckbox
                                        value="lock"
                                        label="Lock/Pin"
                                    />
                                </div>
                            </CheckboxGroup>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>

            {/* --- Technical Summary Footer --- */}
            <div className="p-4 bg-default-50 rounded-2xl border border-divider mt-10">
                <p className="text-[10px] uppercase font-black text-text-subdued tracking-widest mb-2 flex items-center gap-2">
                    <ShieldCheck size={14} /> Security Compliance
                </p>
                <p className="text-xs text-text-subdued italic">
                    Changes take effect immediately for all users currently
                    assigned the <b>{code}</b> role.
                </p>
            </div>
        </div>
    )
}

// Sub-component for consistent styling
const PermissionCheckbox = ({
    value,
    label,
}: {
    value: string
    label: string
}) => (
    <Checkbox
        value={value}
        classNames={{
            label: 'text-sm font-medium text-slate-700',
            base: 'hover:bg-default-100 p-2 rounded-lg transition-colors',
        }}
    >
        {label}
    </Checkbox>
)
