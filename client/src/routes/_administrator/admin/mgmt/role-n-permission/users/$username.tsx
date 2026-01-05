export const Route = createFileRoute(
    '/_administrator/admin/mgmt/role-n-permission/users/$username'
)({
    component: UserAccessPage,
})

import {
    Button,
    Avatar,
    Chip,
    Divider,
    Switch,
    Select,
    SelectItem,
    Card,
    CardBody,
} from '@heroui/react'
import {
    ArrowLeft,
    Save,
    ShieldCheck,
    History,
    AlertTriangle,
    ShieldAlert,
    CheckCircle2,
    XCircle,
} from 'lucide-react'
import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { PageHeading, HeroCard } from '@/shared/components'

export default function UserAccessPage() {
    const navigate = useNavigate()

    // Mock data for the specific user
    const userProfile = {
        name: 'Dang Son',
        username: 'asjdasj',
        role: 'Moderator',
        avatar: '',
        department: 'Content Quality',
    }

    return (
        <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
            {/* --- Navigation & Header --- */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Button
                        isIconOnly
                        variant="flat"
                        radius="full"
                        onPress={() =>
                            navigate({ to: '/admin/role-n-permission/users' })
                        }
                    >
                        <ArrowLeft size={20} />
                    </Button>
                    <div className="flex items-center gap-4">
                        <Avatar
                            src={userProfile.avatar}
                            size="lg"
                            isBordered
                            color="primary"
                            className="w-16 h-16"
                        />
                        <div>
                            <h1 className="text-2xl font-black tracking-tight">
                                {userProfile.name}
                            </h1>
                            <p className="text-text-subdued text-sm font-medium flex items-center gap-2">
                                @{userProfile.username} •{' '}
                                <span className="text-primary font-bold">
                                    {userProfile.department}
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
                        Save Access
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* --- Left Column: Primary Role Assignment --- */}
                <div className="space-y-6">
                    <HeroCard
                        title="Primary Identity"
                        className="border-divider"
                    >
                        <CardBody className="p-6 space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase text-text-subdued tracking-widest">
                                    Current Role
                                </label>
                                <Select
                                    defaultSelectedKeys={[
                                        userProfile.role.toLowerCase(),
                                    ]}
                                    variant="bordered"
                                    className="w-full"
                                >
                                    <SelectItem key="admin" textValue="Admin">
                                        Admin (Full Access)
                                    </SelectItem>
                                    <SelectItem
                                        key="moderator"
                                        textValue="Moderator"
                                    >
                                        Moderator (High Access)
                                    </SelectItem>
                                    <SelectItem key="member" textValue="Member">
                                        Member (Standard Access)
                                    </SelectItem>
                                </Select>
                                <p className="text-[10px] text-warning-600 flex items-start gap-1 bg-warning-50 p-2 rounded-lg mt-2">
                                    <AlertTriangle
                                        size={12}
                                        className="shrink-0 mt-0.5"
                                    />
                                    Changing the primary role will reset all
                                    current inherited permissions.
                                </p>
                            </div>
                        </CardBody>
                    </HeroCard>

                    <Card className="bg-slate-900 text-white border-none p-6 rounded-[2rem]">
                        <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                            <ShieldCheck size={20} className="text-primary" />{' '}
                            Access Summary
                        </h4>
                        <p className="text-slate-400 text-xs mb-4">
                            Current effective rights for this user.
                        </p>
                        <ul className="space-y-3">
                            <AccessSummaryItem
                                label="Can moderate all posts"
                                active
                            />
                            <AccessSummaryItem
                                label="Can update community info"
                                active={false}
                            />
                            <AccessSummaryItem
                                label="Can manage staff roles"
                                active={false}
                            />
                        </ul>
                    </Card>
                </div>

                {/* --- Right Column: Granular Permission Overrides --- */}
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <ShieldAlert size={22} className="text-primary" />{' '}
                        Permission Overrides
                    </h3>
                    <p className="text-text-subdued text-sm -mt-4">
                        Manually grant or revoke specific rights outside of the
                        primary role.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {['Community', 'Topic', 'Post', 'Comment'].map(
                            (entity) => (
                                <HeroCard
                                    key={entity}
                                    className="border-divider hover:shadow-md transition-shadow"
                                >
                                    <CardBody className="p-5">
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="font-black text-sm uppercase tracking-tighter">
                                                {entity} Actions
                                            </h4>
                                            <Chip
                                                size="sm"
                                                variant="flat"
                                                color="primary"
                                            >
                                                Inherited
                                            </Chip>
                                        </div>
                                        <div className="space-y-4">
                                            <PermissionToggle
                                                label="Create"
                                                inheritedValue={true}
                                            />
                                            <PermissionToggle
                                                label="Update"
                                                inheritedValue={false}
                                            />
                                            <PermissionToggle
                                                label="Delete"
                                                inheritedValue={
                                                    entity === 'Post'
                                                }
                                            />
                                            <PermissionToggle
                                                label="Moderate"
                                                inheritedValue={
                                                    entity !== 'Comment'
                                                }
                                            />
                                        </div>
                                    </CardBody>
                                </HeroCard>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

// --- Sub-components for cleaner code ---

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
    inheritedValue,
}: {
    label: string
    inheritedValue: boolean
}) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-700">
                    {label}
                </span>
                <span className="text-[10px] text-text-subdued italic">
                    {inheritedValue ? 'Default: Allowed' : 'Default: Denied'}
                </span>
            </div>
            <Switch defaultSelected={inheritedValue} size="sm" />
        </div>
    )
}
