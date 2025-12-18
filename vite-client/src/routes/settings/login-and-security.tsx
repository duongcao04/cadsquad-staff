import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/settings/login-and-security')({
    component: SecuritySettingsPage,
})

import React, { useState } from 'react'
import {
    Card,
    CardBody,
    CardHeader,
    Input,
    Button,
    Switch,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Chip,
    Tooltip,
    Divider,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from '@heroui/react'
import {
    Lock,
    Shield,
    Smartphone,
    LogOut,
    MapPin,
    AlertTriangle,
    CheckCircle2,
    KeyRound,
    Eye,
    EyeOff,
    Globe,
    Clock,
    Laptop,
    House,
} from 'lucide-react'
import { INTERNAL_URLS } from '../../lib'
import { HeroBreadcrumbs, HeroBreadcrumbItem } from '../../shared/components'

// --- Mock Data ---
const ACTIVE_SESSIONS = [
    {
        id: '1',
        device: 'Chrome on Windows',
        ip: '115.79.x.x',
        location: 'Ho Chi Minh City, VN',
        lastActive: 'Current Session',
        isCurrent: true,
        icon: Laptop,
    },
    {
        id: '2',
        device: 'Safari on iPhone 13',
        ip: '14.161.x.x',
        location: 'Hanoi, VN',
        lastActive: '2 hours ago',
        isCurrent: false,
        icon: Smartphone,
    },
    {
        id: '3',
        device: 'Firefox on Mac',
        ip: '27.72.x.x',
        location: 'Da Nang, VN',
        lastActive: '5 days ago',
        isCurrent: false,
        icon: Laptop,
    },
]

const LOGIN_HISTORY = [
    {
        id: 1,
        event: 'Login Success',
        date: 'Oct 24, 2025 09:30 AM',
        ip: '115.79.x.x',
        status: 'SUCCESS',
    },
    {
        id: 2,
        event: 'Password Changed',
        date: 'Oct 20, 2025 02:15 PM',
        ip: '115.79.x.x',
        status: 'SUCCESS',
    },
    {
        id: 3,
        event: 'Failed Attempt',
        date: 'Oct 18, 2025 11:00 PM',
        ip: '113.22.x.x',
        status: 'FAILED',
    },
    {
        id: 4,
        event: '2FA Enabled',
        date: 'Oct 15, 2025 10:00 AM',
        ip: '115.79.x.x',
        status: 'SUCCESS',
    },
]

function SecuritySettingsPage() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure() // For 2FA Modal
    const [isVisible, setIsVisible] = useState(false) // Password visibility
    const [is2FAEnabled, setIs2FAEnabled] = useState(true)

    const toggleVisibility = () => setIsVisible(!isVisible)

    return (
        <>
            <HeroBreadcrumbs className="text-xs">
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
                        to={INTERNAL_URLS.settings}
                        className="text-text-subdued!"
                    >
                        Settings
                    </Link>
                </HeroBreadcrumbItem>
                <HeroBreadcrumbItem>Login & Security</HeroBreadcrumbItem>
            </HeroBreadcrumbs>

            <div className="mt-5">
                {/* Header */}
                <div>
                    <h1 className="text-xl font-bold text-text-default mb-1">
                        Login & Security
                    </h1>
                    <p className="text-sm text-text-subdued">
                        Manage your password, 2FA, and active sessions.
                    </p>
                </div>

                <div className="mt-7 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* --- LEFT COLUMN: Credentials --- */}
                    <div className="size-full lg:col-span-1 space-y-6">
                        {/* Change Password */}
                        <Card className="shadow-sm border border-border-default">
                            <CardHeader className="px-6 pt-6 pb-2">
                                <h4 className="font-bold text-lg text-text-default flex items-center gap-2">
                                    <KeyRound
                                        size={20}
                                        className="text-primary"
                                    />{' '}
                                    Password
                                </h4>
                            </CardHeader>
                            <CardBody className="px-6 pb-6 gap-4">
                                <Input
                                    label="Current Password"
                                    placeholder="Enter current password"
                                    endContent={
                                        <button
                                            className="focus:outline-none"
                                            type="button"
                                            onClick={toggleVisibility}
                                        >
                                            {isVisible ? (
                                                <EyeOff className="text-2xl text-default-400 pointer-events-none" />
                                            ) : (
                                                <Eye className="text-2xl text-default-400 pointer-events-none" />
                                            )}
                                        </button>
                                    }
                                    type={isVisible ? 'text' : 'password'}
                                    variant="bordered"
                                />
                                <Divider />
                                <Input
                                    label="New Password"
                                    placeholder="Minimum 8 characters"
                                    type="password"
                                    variant="bordered"
                                />
                                <Input
                                    label="Confirm New Password"
                                    placeholder="Re-enter new password"
                                    type="password"
                                    variant="bordered"
                                />
                                <div className="flex justify-end pt-2">
                                    <Button
                                        color="primary"
                                        isDisabled
                                        size="sm"
                                    >
                                        Update Password
                                    </Button>
                                </div>
                            </CardBody>
                        </Card>
                    </div>

                    {/* --- RIGHT COLUMN: Activity & Sessions --- */}
                    <div className="size-full lg:col-span-1 space-y-6">
                        {/* 2FA Settings */}
                        <Card className="shadow-sm border border-border-default">
                            <CardHeader className="px-6 pt-6 pb-2">
                                <h4 className="font-bold text-lg text-text-default flex items-center gap-2">
                                    <Shield
                                        size={20}
                                        className="text-success"
                                    />{' '}
                                    Two-Factor Authentication
                                </h4>
                            </CardHeader>
                            <CardBody className="px-6 pb-6">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="pr-4">
                                        <p
                                            className={`font-bold text-sm ${is2FAEnabled ? 'text-success-600' : 'text-slate-500'}`}
                                        >
                                            {is2FAEnabled
                                                ? 'Enabled'
                                                : 'Disabled'}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Secure your account with an
                                            authenticator app (Google Auth,
                                            Authy).
                                        </p>
                                    </div>
                                    <Switch
                                        isSelected={is2FAEnabled}
                                        onValueChange={setIs2FAEnabled}
                                        color="success"
                                    />
                                </div>

                                {!is2FAEnabled && (
                                    <Button
                                        variant="flat"
                                        color="primary"
                                        className="w-full"
                                        onPress={onOpen}
                                    >
                                        Setup 2FA Now
                                    </Button>
                                )}

                                {is2FAEnabled && (
                                    <div className="bg-background-muted p-3 rounded-lg border border-border-default">
                                        <div className="flex items-center gap-2 text-xs font-bold text-text-default mb-2">
                                            <Smartphone size={14} />
                                            Recovery Codes
                                        </div>
                                        <p className="text-xs text-text-subdued mb-3">
                                            You have 3 unused recovery codes
                                            left. Generate new ones if you lost
                                            them.
                                        </p>
                                        <Button
                                            size="sm"
                                            variant="bordered"
                                            className="w-full border-border-default"
                                        >
                                            View Codes
                                        </Button>
                                    </div>
                                )}
                            </CardBody>
                        </Card>
                    </div>
                </div>

                {/* Active Sessions */}
                <Card className="mt-6 shadow-sm border border-border-default">
                    <CardHeader className="px-6 pt-6 pb-2 flex justify-between items-center">
                        <h4 className="font-bold text-lg text-text-default flex items-center gap-2">
                            <Globe size={20} className="text-blue-500" /> Active
                            Sessions
                        </h4>
                        <Button
                            size="sm"
                            variant="light"
                            color="danger"
                            startContent={<LogOut size={16} />}
                        >
                            Log Out All Devices
                        </Button>
                    </CardHeader>
                    <CardBody className="px-6 pb-6">
                        <div className="space-y-4">
                            {ACTIVE_SESSIONS.map((session) => (
                                <div
                                    key={session.id}
                                    className="flex items-center justify-between p-3 border border-border-default rounded-xl hover:bg-slate-50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center ${session.isCurrent ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'}`}
                                        >
                                            <session.icon size={20} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-bold text-slate-700 text-sm">
                                                    {session.device}
                                                </p>
                                                {session.isCurrent && (
                                                    <Chip
                                                        size="sm"
                                                        color="success"
                                                        variant="flat"
                                                        className="h-5 text-[10px]"
                                                    >
                                                        Current
                                                    </Chip>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                                                <span className="flex items-center gap-1">
                                                    <MapPin size={10} />{' '}
                                                    {session.location}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock size={10} />{' '}
                                                    {session.lastActive}
                                                </span>
                                                <span>IP: {session.ip}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {!session.isCurrent && (
                                        <Tooltip content="Revoke Access">
                                            <Button
                                                isIconOnly
                                                size="sm"
                                                variant="light"
                                                color="danger"
                                            >
                                                <LogOut size={16} />
                                            </Button>
                                        </Tooltip>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardBody>
                </Card>

                {/* Login History */}
                <Card className="mt-6 shadow-sm border border-border-default">
                    <CardHeader className="px-6 pt-6 pb-2">
                        <h4 className="font-bold text-lg text-text-default flex items-center gap-2">
                            <Clock size={20} className="text-slate-500" />{' '}
                            Recent Activity
                        </h4>
                    </CardHeader>
                    <CardBody className="p-0">
                        <Table
                            aria-label="Login History"
                            shadow="none"
                            removeWrapper
                        >
                            <TableHeader>
                                <TableColumn>EVENT</TableColumn>
                                <TableColumn>DATE</TableColumn>
                                <TableColumn>IP ADDRESS</TableColumn>
                                <TableColumn align="end">STATUS</TableColumn>
                            </TableHeader>
                            <TableBody>
                                {LOGIN_HISTORY.map((log) => (
                                    <TableRow
                                        key={log.id}
                                        className="hover:bg-slate-50"
                                    >
                                        <TableCell>
                                            <span
                                                className={`font-semibold text-sm ${log.status === 'FAILED' ? 'text-red-500' : 'text-slate-700'}`}
                                            >
                                                {log.event}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-slate-500 text-xs">
                                                {log.date}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-mono text-slate-500 text-xs bg-slate-100 px-2 py-1 rounded">
                                                {log.ip}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex justify-end">
                                                <Chip
                                                    size="sm"
                                                    variant="flat"
                                                    color={
                                                        log.status === 'SUCCESS'
                                                            ? 'success'
                                                            : 'danger'
                                                    }
                                                    startContent={
                                                        log.status ===
                                                        'SUCCESS' ? (
                                                            <CheckCircle2
                                                                size={12}
                                                            />
                                                        ) : (
                                                            <AlertTriangle
                                                                size={12}
                                                            />
                                                        )
                                                    }
                                                >
                                                    {log.status}
                                                </Chip>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardBody>
                </Card>

                {/* 2FA Setup Modal */}
                <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="md">
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader>
                                    Setup Two-Factor Authentication
                                </ModalHeader>
                                <ModalBody className="flex flex-col items-center text-center">
                                    <div className="w-48 h-48 bg-slate-100 rounded-xl mb-4 flex items-center justify-center border border-border-default">
                                        <span className="text-slate-400 font-mono text-xs">
                                            QR CODE PLACEHOLDER
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-600 mb-4">
                                        Scan this QR code with your
                                        authenticator app (Google Authenticator,
                                        Authy, etc.) and enter the code below.
                                    </p>
                                    <Input
                                        placeholder="Enter 6-digit code"
                                        className="max-w-xs text-center font-mono text-lg tracking-widest"
                                        maxLength={6}
                                    />
                                </ModalBody>
                                <ModalFooter>
                                    <Button variant="light" onPress={onClose}>
                                        Cancel
                                    </Button>
                                    <Button
                                        color="primary"
                                        onPress={() => {
                                            setIs2FAEnabled(true)
                                            onClose()
                                        }}
                                    >
                                        Verify & Enable
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            </div>
        </>
    )
}
