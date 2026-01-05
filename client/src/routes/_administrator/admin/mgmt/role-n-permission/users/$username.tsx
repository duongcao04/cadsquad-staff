import { optimizeCloudinary } from '@/lib'
import {
    permissionGroupsListOptions,
    rolesListOptions,
    userOptions,
} from '@/lib/queries'
import { HeroCard, HeroTooltip } from '@/shared/components'
import {
    Avatar,
    Button,
    Card,
    CardBody,
    Select,
    SelectItem,
    Switch,
    Accordion,
    AccordionItem,
    Divider,
} from '@heroui/react'
import { useSuspenseQueries } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
    AlertTriangle,
    ArrowLeft,
    CheckCircle2,
    History,
    Save,
    ShieldAlert,
    ShieldCheck,
    XCircle,
    LayoutGrid,
} from 'lucide-react'
import { useMemo } from 'react'

export const Route = createFileRoute(
    '/_administrator/admin/mgmt/role-n-permission/users/$username'
)({
    loader: ({ context, params }) => {
        void context.queryClient.ensureQueryData(permissionGroupsListOptions())
        void context.queryClient.ensureQueryData(rolesListOptions())
        void context.queryClient.ensureQueryData(userOptions(params.username))
    },
    component: UserAccessPage,
})

export default function UserAccessPage() {
    const navigate = useNavigate()
    const { username } = Route.useParams()

    const [
        { data: user },
        {
            data: { roles },
        },
        { data: permissionGroups },
    ] = useSuspenseQueries({
        queries: [
            { ...userOptions(username) },
            { ...rolesListOptions() },
            { ...permissionGroupsListOptions() },
        ],
    })

    const memberPermissions = useMemo(
        () => user?.role?.permissions?.map((it) => it.entityAction) ?? [],
        [user]
    )
    console.log(memberPermissions)

    return (
        <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
            {/* --- Header Section --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <Button
                        isIconOnly
                        variant="flat"
                        radius="full"
                        onPress={() => navigate({ to: '..' })}
                    >
                        <ArrowLeft size={20} />
                    </Button>
                    <div className="flex items-center gap-4">
                        <Avatar
                            src={optimizeCloudinary(user.avatar)}
                            size="lg"
                            isBordered
                            color="primary"
                            className="w-16 h-16"
                        />
                        <div>
                            <h1 className="text-2xl font-black tracking-tight">
                                {user.displayName}
                            </h1>
                            <p className="text-text-subdued text-sm font-medium flex items-center gap-2">
                                @{user.username} •{' '}
                                <span className="text-primary font-bold">
                                    {user.department?.displayName}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="flat" startContent={<History size={18} />}>
                        Access Logs
                    </Button>
                    <Button
                        color="primary"
                        size="lg"
                        className="font-bold px-8 shadow-xl shadow-primary/30"
                        startContent={<Save size={18} />}
                    >
                        Save Changes
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* --- Left Column: Summary --- */}
                <div className="space-y-6">
                    <HeroCard
                        title="Primary Identity"
                        className="border-divider"
                    >
                        <CardBody className="p-6 space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase text-text-subdued tracking-widest">
                                    Assign Primary Role
                                </label>
                                <Select
                                    defaultSelectedKeys={[user.role.code]}
                                    variant="bordered"
                                    className="w-full"
                                >
                                    {roles.map((role) => (
                                        <SelectItem
                                            key={role.code}
                                            textValue={role.displayName}
                                        >
                                            {role.displayName}
                                        </SelectItem>
                                    ))}
                                </Select>
                                <p className="text-[10px] text-warning-600 flex items-start gap-1 bg-warning-50 p-2 rounded-lg mt-2">
                                    <AlertTriangle
                                        size={12}
                                        className="shrink-0 mt-0.5"
                                    />
                                    Role changes reset custom overrides to the
                                    new role's defaults.
                                </p>
                            </div>
                        </CardBody>
                    </HeroCard>

                    <Card className="bg-slate-900 text-white border-none p-6 rounded-4xl">
                        <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                            <ShieldCheck size={20} className="text-primary" />{' '}
                            Access Summary
                        </h4>
                        <p className="text-slate-400 text-xs mb-4">
                            Effective permissions for this session.
                        </p>
                        <ul className="space-y-3">
                            <AccessSummaryItem
                                label="Global Moderation"
                                active
                            />
                            <AccessSummaryItem
                                label="Community Management"
                                active={false}
                            />
                            <AccessSummaryItem
                                label="Financial Access"
                                active={false}
                            />
                        </ul>
                    </Card>
                </div>

                {/* --- Right Column: Accordion Permissions --- */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center gap-3">
                        <ShieldAlert size={24} className="text-primary" />
                        <div>
                            <h3 className="text-xl font-bold">
                                Permission Overrides
                            </h3>
                            <p className="text-text-subdued text-xs font-medium">
                                Toggle individual rights independent of role
                                assignment.
                            </p>
                        </div>
                    </div>

                    <Accordion
                        variant="splitted"
                        selectionMode="multiple"
                        className="px-0"
                        defaultExpandedKeys={[permissionGroups[0]?.name]}
                    >
                        {permissionGroups.map((group) => (
                            <AccordionItem
                                key={group.name}
                                aria-label={group.name}
                                startContent={
                                    <LayoutGrid
                                        size={18}
                                        className="text-primary"
                                    />
                                }
                                title={
                                    <span className="font-bold text-sm uppercase tracking-tight">
                                        {group.name} Actions
                                    </span>
                                }
                                subtitle={
                                    <span className="text-xs">
                                        {group.permissions.length} individual
                                        permissions
                                    </span>
                                }
                                classNames={{
                                    base: 'border border-divider shadow-sm mb-4',
                                    content:
                                        'grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pb-6',
                                }}
                            >
                                <Divider className="mb-4 col-span-full" />
                                {group.permissions.map((perm) => (
                                    <PermissionToggle
                                        key={perm.displayName}
                                        label={perm.displayName}
                                        description={perm.description}
                                        inheritedValue={memberPermissions.includes(
                                            perm.entityAction
                                        )} // Logic to check if role naturally has this
                                    />
                                ))}
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </div>
    )
}

// --- Sub-components ---

function AccessSummaryItem({
    label,
    active,
}: {
    label: string
    active: boolean
}) {
    return (
        <li className="flex items-center justify-between text-xs font-medium">
            <span
                className={
                    active ? 'text-slate-200' : 'text-slate-500 line-through'
                }
            >
                {label}
            </span>
            {active ? (
                <CheckCircle2 size={14} className="text-success" />
            ) : (
                <XCircle size={14} className="text-slate-600" />
            )}
        </li>
    )
}

function PermissionToggle({
    label,
    description,
    inheritedValue,
}: {
    label: string
    description?: string
    inheritedValue: boolean
}) {
    return (
        <div className="flex items-center justify-between p-2 rounded-xl hover:bg-default-50 transition-colors">
            <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-700">
                    {label}
                </span>
                <span className="text-[10px] text-text-subdued italic">
                    {description}
                </span>
            </div>
            <HeroTooltip
                content={
                    inheritedValue ? 'Inherited from Role' : 'Direct Access'
                }
            >
                <Switch
                    defaultSelected={inheritedValue}
                    size="sm"
                    color="primary"
                />
            </HeroTooltip>
        </div>
    )
}
