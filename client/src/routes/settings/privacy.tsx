import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useFormik } from 'formik'
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    Switch,
    Divider,
    Chip,
} from '@heroui/react'
import {
    EyeIcon,
    EyeOffIcon,
    DownloadIcon,
    Trash2Icon,
    ShieldAlertIcon,
    SmartphoneIcon,
    LaptopIcon,
    LogOutIcon,
} from 'lucide-react'
import { getPageTitle } from '../../lib'

export const Route = createFileRoute('/settings/privacy')({
    head: () => ({
        meta: [
            {
                title: getPageTitle('Privacy & Data'),
            },
        ],
    }),
    component: UserPrivacyPage,
})

// --- MOCK DATA ---
const MOCK_ACTIVE_SESSIONS = [
    {
        id: 'sess-1',
        device: 'MacBook Pro',
        type: 'DESKTOP',
        browser: 'Chrome',
        location: 'Ho Chi Minh City, VN',
        lastActive: 'Now',
        isCurrent: true,
    },
    {
        id: 'sess-2',
        device: 'iPhone 14',
        type: 'MOBILE',
        browser: 'Safari',
        location: 'Ho Chi Minh City, VN',
        lastActive: '2 days ago',
        isCurrent: false,
    },
]

const MOCK_USER_PRIVACY = {
    isProfilePublic: true,
    showOnlineStatus: true,
    allowDataCollection: false,
    saveActivityLog: true,
}

// --- INTERFACE ---
interface PrivacyFormValues {
    isProfilePublic: boolean
    showOnlineStatus: boolean
    allowDataCollection: boolean
    saveActivityLog: boolean
}

function UserPrivacyPage() {
    const [isExporting, setIsExporting] = useState(false)
    const [sessions, setSessions] = useState(MOCK_ACTIVE_SESSIONS)

    const formik = useFormik<PrivacyFormValues>({
        initialValues: MOCK_USER_PRIVACY,
        onSubmit: async (values) => {
            console.log('Updating Privacy Settings:', values)
            // Call API here
        },
    })

    // Simulate Data Export
    const handleExportData = async () => {
        setIsExporting(true)
        // Simulate API generation time
        await new Promise((resolve) => setTimeout(resolve, 2000))
        setIsExporting(false)
        alert('Your data is ready. Downloading started.')
    }

    // Simulate Revoke Session
    const handleRevokeSession = (id: string) => {
        setSessions((prev) => prev.filter((s) => s.id !== id))
    }

    return (
        <div className="mx-auto max-w-4xl p-6 pb-24 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold">Privacy & Data</h1>
                <p className="text-default-500">
                    Manage your visibility, active sessions, and data rights.
                </p>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-6">
                {/* 1. VISIBILITY SETTINGS */}
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-col items-start px-6 pt-6 pb-2">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <EyeIcon size={20} className="text-default-500" />
                            Visibility
                        </h2>
                        <p className="text-small text-default-400">
                            Control who can see your profile and activity.
                        </p>
                    </CardHeader>
                    <Divider className="my-2" />
                    <CardBody className="px-6 pb-6 gap-6">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="font-medium">
                                    Public Profile
                                </span>
                                <span className="text-tiny text-default-400">
                                    Allow other users to find you by name or
                                    email.
                                </span>
                            </div>
                            <Switch
                                isSelected={formik.values.isProfilePublic}
                                onValueChange={(val) =>
                                    formik.setFieldValue('isProfilePublic', val)
                                }
                                color="primary"
                                thumbIcon={({ isSelected, className }) =>
                                    isSelected ? (
                                        <EyeIcon className={className} />
                                    ) : (
                                        <EyeOffIcon className={className} />
                                    )
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="font-medium">
                                    Show Online Status
                                </span>
                                <span className="text-tiny text-default-400">
                                    Let colleagues see when you are active.
                                </span>
                            </div>
                            <Switch
                                isSelected={formik.values.showOnlineStatus}
                                onValueChange={(val) =>
                                    formik.setFieldValue(
                                        'showOnlineStatus',
                                        val
                                    )
                                }
                                color="success"
                            />
                        </div>
                    </CardBody>
                </Card>

                {/* 2. ACTIVE SESSIONS (Security) */}
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-col items-start px-6 pt-6 pb-2">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <ShieldAlertIcon
                                size={20}
                                className="text-default-500"
                            />
                            Active Sessions
                        </h2>
                        <p className="text-small text-default-400">
                            Manage devices currently logged into your account.
                        </p>
                    </CardHeader>
                    <Divider className="my-2" />
                    <CardBody className="px-6 pb-6 gap-4">
                        {sessions.map((session) => (
                            <div
                                key={session.id}
                                className="flex items-center justify-between p-3 rounded-lg border border-default-200 bg-default-50/50"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-default-200 rounded-full text-default-600">
                                        {session.type === 'DESKTOP' ? (
                                            <LaptopIcon size={20} />
                                        ) : (
                                            <SmartphoneIcon size={20} />
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-small">
                                                {session.device}
                                            </span>
                                            {session.isCurrent && (
                                                <Chip
                                                    size="sm"
                                                    color="success"
                                                    variant="flat"
                                                    className="h-5 text-[10px]"
                                                >
                                                    THIS DEVICE
                                                </Chip>
                                            )}
                                        </div>
                                        <span className="text-tiny text-default-500">
                                            {session.browser} •{' '}
                                            {session.location}
                                        </span>
                                        <span className="text-tiny text-default-400">
                                            Active: {session.lastActive}
                                        </span>
                                    </div>
                                </div>
                                {!session.isCurrent && (
                                    <Button
                                        size="sm"
                                        variant="light"
                                        color="danger"
                                        onPress={() =>
                                            handleRevokeSession(session.id)
                                        }
                                        startContent={<LogOutIcon size={16} />}
                                    >
                                        Revoke
                                    </Button>
                                )}
                            </div>
                        ))}
                    </CardBody>
                </Card>

                {/* 3. YOUR DATA (GDPR/Export) */}
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-col items-start px-6 pt-6 pb-2">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <DownloadIcon
                                size={20}
                                className="text-default-500"
                            />
                            Your Data
                        </h2>
                        <p className="text-small text-default-400">
                            Access or remove your personal information.
                        </p>
                    </CardHeader>
                    <Divider className="my-2" />
                    <CardBody className="px-6 pb-6 gap-6">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="font-medium">Export Data</span>
                                <span className="text-tiny text-default-400">
                                    Download a copy of your profile, jobs, and
                                    logs in JSON format.
                                </span>
                            </div>
                            <Button
                                variant="flat"
                                onPress={handleExportData}
                                isLoading={isExporting}
                                startContent={
                                    !isExporting && <DownloadIcon size={18} />
                                }
                            >
                                Download Archive
                            </Button>
                        </div>

                        <Divider className="bg-default-100" />

                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="font-medium">
                                    Activity History
                                </span>
                                <span className="text-tiny text-default-400">
                                    Save search history and job views to improve
                                    recommendations.
                                </span>
                            </div>
                            <Switch
                                isSelected={formik.values.saveActivityLog}
                                onValueChange={(val) =>
                                    formik.setFieldValue('saveActivityLog', val)
                                }
                                size="sm"
                            />
                        </div>
                    </CardBody>
                </Card>

                {/* 4. DANGER ZONE */}
                <Card className="border border-danger-200 bg-danger-50 dark:bg-danger-900/10 shadow-none">
                    <CardBody className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6">
                        <div className="flex flex-col">
                            <h3 className="text-medium font-bold text-danger">
                                Delete Account
                            </h3>
                            <p className="text-small text-danger-600/80">
                                Permanently remove your account and all
                                associated personal data. This action cannot be
                                undone.
                            </p>
                        </div>
                        <Button
                            color="danger"
                            variant="solid"
                            startContent={<Trash2Icon size={18} />}
                        >
                            Delete Account
                        </Button>
                    </CardBody>
                </Card>
            </form>
        </div>
    )
}
