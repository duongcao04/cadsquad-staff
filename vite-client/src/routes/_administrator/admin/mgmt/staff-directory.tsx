import { createFileRoute } from '@tanstack/react-router'
import React, { useMemo, useState } from 'react'
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Avatar,
    Button,
    Input,
    Chip,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Select,
    SelectItem,
    Pagination,
    Divider,
} from '@heroui/react'
import {
    Search,
    Plus,
    MoreVertical,
    Mail,
    Phone,
    Briefcase,
    MapPin,
    Filter,
} from 'lucide-react'

export const Route = createFileRoute('/_administrator/admin/mgmt/staff-directory')({
    component: StaffDirectory,
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

function StaffDirectory() {
    const [filterValue, setFilterValue] = useState('')
    const [departmentFilter, setDepartmentFilter] = useState<string>('all')

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
        <div className="p-8 max-w-[1600px] mx-auto space-y-8">
            {/* --- Header Section --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">
                        Staff Directory
                    </h1>
                    <p className="text-default-500 text-sm mt-1">
                        Manage your team, view contact details, and update
                        permissions.
                    </p>
                </div>
                <Button
                    color="primary"
                    endContent={<Plus size={16} />}
                    className="font-semibold shadow-lg shadow-primary/20"
                >
                    Add Member
                </Button>
            </div>

            {/* --- Toolbar Section --- */}
            <div className="flex flex-col md:flex-row gap-4 items-center bg-content1 p-4 rounded-2xl shadow-sm border border-default-100">
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
                        <SelectItem key={dept.key} value={dept.key}>
                            {dept.label}
                        </SelectItem>
                    ))}
                </Select>

                <div className="ml-auto text-default-400 text-xs font-medium">
                    Showing {filteredItems.length} members
                </div>
            </div>

            {/* --- Grid Content --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredItems.map((user) => (
                    <Card key={user.id} className="w-full" shadow="sm">
                        <CardHeader className="justify-between items-start pt-5 px-5">
                            <div className="flex gap-4">
                                <Avatar
                                    isBordered
                                    radius="lg"
                                    size="lg"
                                    src={user.avatar}
                                    color={
                                        user.isActive ? 'success' : 'default'
                                    }
                                />
                                <div className="flex flex-col gap-1 items-start justify-center">
                                    <h4 className="text-small font-bold leading-none text-default-900">
                                        {user.displayName}
                                    </h4>
                                    <h5 className="text-small tracking-tight text-default-500">
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
                                    <DropdownItem key="view">
                                        View Profile
                                    </DropdownItem>
                                    <DropdownItem key="edit">
                                        Edit Details
                                    </DropdownItem>
                                    <DropdownItem
                                        key="delete"
                                        className="text-danger"
                                        color="danger"
                                    >
                                        Deactivate User
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </CardHeader>

                        <CardBody className="px-5 py-3 text-small text-default-400">
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
                                            color: user.department?.hexColor,
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
                                    {user.location && (
                                        <div className="flex items-center gap-3">
                                            <MapPin size={16} />
                                            <span>{user.location}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardBody>

                        <CardFooter className="gap-3 px-5 pb-5 pt-0">
                            <div className="flex-1 flex gap-2">
                                <Button
                                    className="flex-1"
                                    variant="flat"
                                    color="primary"
                                    size="sm"
                                    startContent={<Briefcase size={16} />}
                                >
                                    Assign Job
                                </Button>
                                <Button
                                    isIconOnly
                                    variant="bordered"
                                    size="sm"
                                    className="border-default-200"
                                >
                                    <Mail size={16} />
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
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
        </div>
    )
}
