import { INTERNAL_URLS, optimizeCloudinary } from '@/lib'
import { usersListOptions } from '@/lib/queries'
import {
    HeroBreadcrumbItem,
    HeroBreadcrumbs,
    HeroButton,
    HeroCard,
    HeroCardBody,
    HeroCardFooter,
    HeroCardHeader,
    HeroTooltip,
} from '@/shared/components'
import AdminContentContainer from '@/shared/components/admin/AdminContentContainer'
import { AssignJobModal } from '@/shared/components/staff-directory/AssignJobModal'
import { DeactivateUserModal } from '@/shared/components/staff-directory/DeactiveUserModal'
import { EmailUserModal } from '@/shared/components/staff-directory/EmailUserModal'
import { SendNotificationModal } from '@/shared/components/staff-directory/SendNotificationModal'
import { TUser } from '@/shared/types'
import {
    Avatar,
    Button,
    Chip,
    Divider,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownSection,
    DropdownTrigger,
    Input,
    Pagination,
    Select,
    SelectItem,
    useDisclosure,
} from '@heroui/react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
    Briefcase,
    Filter,
    House,
    Mail,
    MoreVertical,
    Phone,
    RotateCcw,
    Search,
    SendIcon,
    UserPen,
} from 'lucide-react'
import { useMemo, useState } from 'react'

export const Route = createFileRoute(
    '/_administrator/admin/mgmt/staff-directory/'
)({
    loader: ({ context }) => {
        return context.queryClient.ensureQueryData(usersListOptions())
    },
    component: StaffDirectoryPage,
})

// --- Types based on your Prisma Schema ---
type RoleEnum = 'ADMIN' | 'USER' | 'ACCOUNTING'

interface JobTitle {
    id: string
    displayName: string
}

interface Department {
    id: string
    displayName: string
    hexColor: string
}

interface StaffMember {
    id: string
    displayName: string
    email: string
    avatar: string
    phoneNumber?: string
    role: RoleEnum
    isActive: boolean
    jobTitle?: JobTitle
    department?: Department
    location?: string
}

// --- Mock Data ---
const MOCK_STAFF: StaffMember[] = [
    {
        id: '1',
        displayName: 'Sarah Wilson',
        email: 'sarah.w@hiveq.com',
        avatar: 'https://i.pravatar.cc/150?u=sarah',
        phoneNumber: '+1 234 567 890',
        role: 'USER',
        isActive: true,
        jobTitle: { id: 'jt1', displayName: 'Senior UI Designer' },
        department: {
            id: 'd1',
            displayName: 'Design Team',
            hexColor: '#8B5CF6',
        },
        location: 'New York, USA',
    },
    {
        id: '2',
        displayName: 'David Chen',
        email: 'david.c@hiveq.com',
        avatar: 'https://i.pravatar.cc/150?u=david',
        phoneNumber: '+1 987 654 321',
        role: 'ADMIN',
        isActive: true,
        jobTitle: { id: 'jt2', displayName: 'Lead Developer' },
        department: {
            id: 'd2',
            displayName: 'Development',
            hexColor: '#3B82F6',
        },
        location: 'San Francisco, USA',
    },
    {
        id: '3',
        displayName: 'Amanda Lo',
        email: 'amanda.l@hiveq.com',
        avatar: 'https://i.pravatar.cc/150?u=amanda',
        role: 'ACCOUNTING',
        isActive: false,
        jobTitle: { id: 'jt3', displayName: 'Financial Analyst' },
        department: { id: 'd3', displayName: 'Finance', hexColor: '#F59E0B' },
        location: 'London, UK',
    },
    {
        id: '4',
        displayName: 'James Smith',
        email: 'james.s@hiveq.com',
        avatar: 'https://i.pravatar.cc/150?u=james',
        phoneNumber: '+44 20 1234 5678',
        role: 'USER',
        isActive: true,
        jobTitle: { id: 'jt4', displayName: 'Marketing Manager' },
        department: { id: 'd4', displayName: 'Marketing', hexColor: '#EC4899' },
        location: 'Remote',
    },
    {
        id: '5',
        displayName: 'Alex Johnson',
        email: 'alex.j@hiveq.com',
        avatar: 'https://i.pravatar.cc/150?u=alex',
        role: 'USER',
        isActive: true,
        jobTitle: { id: 'jt5', displayName: 'Frontend Dev' },
        department: {
            id: 'd2',
            displayName: 'Development',
            hexColor: '#3B82F6',
        },
        location: 'Berlin, DE',
    },
]

const DEPARTMENTS = [
    { key: 'all', label: 'All Departments' },
    { key: 'Design Team', label: 'Design Team' },
    { key: 'Development', label: 'Development' },
    { key: 'Marketing', label: 'Marketing' },
    { key: 'Finance', label: 'Finance' },
]

function StaffDirectoryPage() {
    const options = usersListOptions()
    const {
        data: { users },
    } = useSuspenseQuery(options)

    const {
        isOpen: isOpenAssignJobModal,
        onOpen: onOpenAssignJobModal,
        onClose: onCloseAssignJobModal,
    } = useDisclosure({
        id: 'AssignJobModal',
    })
    const {
        isOpen: isOpenEmailUserModal,
        onOpen: onOpenEmailUserModal,
        onClose: onCloseEmailUserModal,
    } = useDisclosure({
        id: 'EmailUserModal',
    })
    const {
        isOpen: isOpenSendNotificationModal,
        onOpen: onOpenSendNotificationModal,
        onClose: onCloseSendNotificationModal,
    } = useDisclosure({
        id: 'SendNotificationModal',
    })
    const {
        isOpen: isOpenDeactivateUserModal,
        onOpen: onOpenDeactivateUserModal,
        onClose: onCloseDeactivateUserModal,
    } = useDisclosure({
        id: 'DeactivateUserModal',
    })

    const [filterValue, setFilterValue] = useState('')
    const [departmentFilter, setDepartmentFilter] = useState<string>('all')
    const [selectedUser, setSelectedUser] = useState<null | TUser>(null)

    const handleOpenAssignModal = (user: TUser) => {
        setSelectedUser(user)
        onOpenAssignJobModal()
    }
    const handleOpenEmailUserModal = (user: TUser) => {
        setSelectedUser(user)
        onOpenEmailUserModal()
    }
    const handleOpenSendNotificationModal = (user: TUser) => {
        setSelectedUser(user)
        onOpenSendNotificationModal()
    }
    const handleOpenDeactivateUserModal = (user: TUser) => {
        setSelectedUser(user)
        onOpenDeactivateUserModal()
    }

    // --- Filtering Logic ---
    const filteredItems = useMemo(() => {
        let filteredUsers = [...MOCK_STAFF]

        if (filterValue) {
            filteredUsers = filteredUsers.filter(
                (user) =>
                    user.displayName
                        .toLowerCase()
                        .includes(filterValue.toLowerCase()) ||
                    user.email.toLowerCase().includes(filterValue.toLowerCase())
            )
        }

        if (departmentFilter !== 'all' && departmentFilter !== '') {
            filteredUsers = filteredUsers.filter(
                (user) => user.department?.displayName === departmentFilter
            )
        }

        return filteredUsers
    }, [filterValue, departmentFilter])

    // --- Helper for Role Color ---
    const getRoleColor = (role: RoleEnum) => {
        switch (role) {
            case 'ADMIN':
                return 'danger'
            case 'ACCOUNTING':
                return 'warning'
            case 'USER':
                return 'primary'
            default:
                return 'default'
        }
    }

    return (
        <>
            {isOpenAssignJobModal && selectedUser && (
                <AssignJobModal
                    isOpen={isOpenAssignJobModal}
                    onClose={onCloseAssignJobModal}
                    user={selectedUser}
                />
            )}
            {isOpenEmailUserModal && selectedUser && (
                <EmailUserModal
                    isOpen={isOpenEmailUserModal}
                    onClose={onCloseEmailUserModal}
                    user={selectedUser}
                />
            )}
            {isOpenSendNotificationModal && selectedUser && (
                <SendNotificationModal
                    isOpen={isOpenSendNotificationModal}
                    onClose={onCloseSendNotificationModal}
                    user={selectedUser}
                />
            )}
            {isOpenDeactivateUserModal && selectedUser && (
                <DeactivateUserModal
                    isOpen={isOpenDeactivateUserModal}
                    onClose={onCloseDeactivateUserModal}
                    user={selectedUser}
                />
            )}
            <HeroBreadcrumbs className="pt-3 px-7 text-xs">
                <HeroBreadcrumbItem>
                    <Link
                        to={INTERNAL_URLS.home}
                        className="text-text-subdued!"
                    >
                        <House size={16} />
                    </Link>
                </HeroBreadcrumbItem>
                <HeroBreadcrumbItem>
                    <Link
                        to={INTERNAL_URLS.admin}
                        className="text-text-subdued!"
                    >
                        Admin
                    </Link>
                </HeroBreadcrumbItem>
                <HeroBreadcrumbItem>Staff Directory</HeroBreadcrumbItem>
            </HeroBreadcrumbs>

            <AdminContentContainer className="mt-1">
                {/* --- Toolbar Section --- */}
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <Input
                        isClearable
                        className="w-full md:max-w-md"
                        placeholder="Search by name or email..."
                        startContent={
                            <Search size={18} className="text-default-400" />
                        }
                        value={filterValue}
                        onClear={() => setFilterValue('')}
                        onValueChange={setFilterValue}
                        radius="lg"
                    />

                    <Select
                        label="Department"
                        placeholder="Filter by department"
                        labelPlacement="outside-left"
                        className="w-full md:max-w-xs"
                        defaultSelectedKeys={['all']}
                        onChange={(e) => setDepartmentFilter(e.target.value)}
                        startContent={
                            <Filter size={16} className="text-default-400" />
                        }
                    >
                        {DEPARTMENTS.map((dept) => (
                            <SelectItem key={dept.key} textValue={dept.key}>
                                {dept.label}
                            </SelectItem>
                        ))}
                    </Select>

                    <div className="ml-auto text-default-400 text-xs font-medium">
                        Showing {filteredItems.length} members
                    </div>
                </div>

                {/* --- Grid Content --- */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {users.map((user) => (
                        <HeroCard key={user.id} className="w-full" shadow="sm">
                            <HeroCardHeader className="justify-between items-start pt-5 px-5">
                                <div className="flex gap-4">
                                    <Avatar
                                        isBordered
                                        radius="lg"
                                        size="lg"
                                        src={optimizeCloudinary(user.avatar, {
                                            width: 512,
                                            height: 512,
                                        })}
                                        color={
                                            user.isActive
                                                ? 'success'
                                                : 'default'
                                        }
                                    />
                                    <div className="flex flex-col gap-1 items-start justify-center">
                                        <Link
                                            to={INTERNAL_URLS.editStaffDetails(
                                                user.username
                                            )}
                                        >
                                            <h4 className="text-sm font-semibold text-text-default">
                                                {user.displayName}
                                            </h4>
                                        </Link>
                                        <h5 className="text-xs tracking-tight font-medium text-text-subdued">
                                            {user.jobTitle?.displayName ||
                                                'No Title'}
                                        </h5>
                                    </div>
                                </div>

                                <Dropdown>
                                    <DropdownTrigger>
                                        <Button
                                            isIconOnly
                                            size="sm"
                                            variant="light"
                                            className="text-default-400"
                                        >
                                            <MoreVertical size={20} />
                                        </Button>
                                    </DropdownTrigger>
                                    <DropdownMenu aria-label="User Actions">
                                        <DropdownSection showDivider>
                                            <DropdownItem key="view">
                                                View Profile
                                            </DropdownItem>
                                            <DropdownItem
                                                key="edit"
                                                children={
                                                    <Link
                                                        className="block size-full"
                                                        to={INTERNAL_URLS.editStaffDetails(
                                                            user.username
                                                        )}
                                                    >
                                                        Edit Details
                                                    </Link>
                                                }
                                            />
                                        </DropdownSection>
                                        <DropdownSection
                                            title="Update user"
                                            showDivider
                                        >
                                            <DropdownItem
                                                key="resetPassword"
                                                startContent={
                                                    <RotateCcw
                                                        size={14}
                                                        className="text-text-default"
                                                    />
                                                }
                                                // onPress={onOpenResetPWModal}
                                            >
                                                Reset password
                                            </DropdownItem>
                                            <DropdownItem
                                                key="renameUser"
                                                startContent={
                                                    <UserPen
                                                        size={14}
                                                        className="text-text-default"
                                                    />
                                                }
                                                // onPress={onOpenUpdateUsernameModal}
                                            >
                                                Rename user
                                            </DropdownItem>
                                        </DropdownSection>
                                        <DropdownSection title="Danger zone">
                                            <DropdownItem
                                                key="delete"
                                                className="text-danger"
                                                color="danger"
                                                onPress={() => {
                                                    handleOpenDeactivateUserModal(
                                                        user
                                                    )
                                                }}
                                            >
                                                Deactivate User
                                            </DropdownItem>
                                        </DropdownSection>
                                    </DropdownMenu>
                                </Dropdown>
                            </HeroCardHeader>

                            <HeroCardBody className="px-5 pt-1 pb-3 text-small text-default-400">
                                <div className="space-y-3">
                                    {/* Department & Role Chips */}
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        <Chip
                                            size="sm"
                                            variant="flat"
                                            className="border-none"
                                            // Custom style for dynamic hex colors from DB
                                            style={{
                                                backgroundColor: `${user.department?.hexColor}20`, // 20% opacity
                                                color: user.department
                                                    ?.hexColor,
                                            }}
                                        >
                                            {user.department?.displayName}
                                        </Chip>
                                        <Chip
                                            size="sm"
                                            variant="dot"
                                            color={getRoleColor(user.role)}
                                            className="capitalize border-none"
                                        >
                                            {user.role.toLowerCase()}
                                        </Chip>
                                    </div>

                                    <Divider className="my-2" />

                                    {/* Contact Info */}
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <Mail size={16} />
                                            <span className="truncate">
                                                {user.email}
                                            </span>
                                        </div>
                                        {user.phoneNumber && (
                                            <div className="flex items-center gap-3">
                                                <Phone size={16} />
                                                <span>{user.phoneNumber}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </HeroCardBody>

                            <HeroCardFooter className="gap-3 px-5 pb-5 pt-0">
                                <div className="flex-1 flex gap-2">
                                    <Button
                                        className="flex-1"
                                        variant="flat"
                                        color="primary"
                                        size="sm"
                                        startContent={<Briefcase size={16} />}
                                        onPress={() => {
                                            handleOpenAssignModal(user)
                                        }}
                                    >
                                        Assign Job
                                    </Button>

                                    <HeroTooltip content="Email user">
                                        <HeroButton
                                            isIconOnly
                                            variant="bordered"
                                            size="sm"
                                            color="default"
                                            className="border-1"
                                            onPress={() => {
                                                handleOpenEmailUserModal(user)
                                            }}
                                        >
                                            <Mail
                                                size={16}
                                                className="text-text-7"
                                            />
                                        </HeroButton>
                                    </HeroTooltip>
                                    <HeroTooltip content="Send notification">
                                        <HeroButton
                                            isIconOnly
                                            variant="bordered"
                                            size="sm"
                                            color="default"
                                            className="border-1"
                                            onPress={() => {
                                                handleOpenSendNotificationModal(
                                                    user
                                                )
                                            }}
                                        >
                                            <SendIcon
                                                size={16}
                                                className="text-text-7"
                                            />
                                        </HeroButton>
                                    </HeroTooltip>
                                </div>
                            </HeroCardFooter>
                        </HeroCard>
                    ))}
                </div>

                {/* --- Pagination --- */}
                <div className="flex justify-center mt-8">
                    <Pagination
                        total={10}
                        initialPage={1}
                        color="primary"
                        variant="flat"
                        showControls
                    />
                </div>
            </AdminContentContainer>
        </>
    )
}
