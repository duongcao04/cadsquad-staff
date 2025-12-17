import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/settings/notifications')({
    component: NotificationSettingsPage,
})

import React, { useState } from 'react'
import {
    Card,
    CardBody,
    CardHeader,
    Switch,
    Button,
    Select,
    SelectItem,
    Divider,
    Chip,
    Avatar,
    Badge,
    Tooltip,
} from '@heroui/react'
import {
    Bell,
    Mail,
    Smartphone,
    Laptop,
    Moon,
    Save,
    Trash2,
    CheckCircle2,
    AlertCircle,
    Clock,
    Zap,
    MessageSquare,
    Briefcase,
} from 'lucide-react'

// --- Mock Data: User Preferences (Stored in UserConfig JSON) ---
const INITIAL_PREFS = {
    channels: {
        email: true,
        browser: true,
        mobile: false,
    },
    dnd: {
        enabled: true,
        start: '22:00',
        end: '08:00',
        timezone: 'Asia/Ho_Chi_Minh',
    },
    triggers: [
        {
            id: 'job_assign',
            label: 'Job Assigned',
            desc: 'When you are added to a new job',
            email: true,
            push: true,
            inApp: true,
            icon: Briefcase,
        },
        {
            id: 'job_status',
            label: 'Job Status Change',
            desc: 'When a job moves to a new stage',
            email: false,
            push: true,
            inApp: true,
            icon: Zap,
        },
        {
            id: 'comments',
            label: 'New Comments',
            desc: 'When someone comments on your job',
            email: true,
            push: true,
            inApp: true,
            icon: MessageSquare,
        },
        {
            id: 'mentions',
            label: 'Mentions (@)',
            desc: 'When someone tags you directly',
            email: true,
            push: true,
            inApp: true,
            icon: Bell,
        },
        {
            id: 'deadline',
            label: 'Deadline Warning',
            desc: '24h before a job is due',
            email: true,
            push: true,
            inApp: true,
            icon: Clock,
        },
        {
            id: 'system',
            label: 'System Alerts',
            desc: 'Maintenance and security updates',
            email: true,
            push: false,
            inApp: true,
            icon: AlertCircle,
        },
    ],
}

// --- Mock Data: Devices (Stored in UserDevices / BrowserSubscribes) ---
const DEVICES = [
    {
        id: '1',
        name: 'Chrome on Windows',
        type: 'BROWSER',
        lastActive: 'Just now',
        current: true,
        icon: Laptop,
    },
    {
        id: '2',
        name: 'iPhone 13 Pro',
        type: 'MOBILE',
        lastActive: '2 hours ago',
        current: false,
        icon: Smartphone,
    },
    {
        id: '3',
        name: 'Safari on MacBook',
        type: 'BROWSER',
        lastActive: '1 week ago',
        current: false,
        icon: Laptop,
    },
]

function NotificationSettingsPage() {
    const [prefs, setPrefs] = useState(INITIAL_PREFS)
    const [isSaving, setIsSaving] = useState(false)

    // Toggle Helper
    const toggleTrigger = (
        index: number,
        channel: 'email' | 'push' | 'inApp'
    ) => {
        const newTriggers = [...prefs.triggers]
        newTriggers[index][channel] = !newTriggers[index][channel]
        setPrefs({ ...prefs, triggers: newTriggers })
    }

    const handleSave = () => {
        setIsSaving(true)
        // Simulate API Call
        setTimeout(() => setIsSaving(false), 1000)
    }

    return (
        <div className="p-8 max-w-[1200px] mx-auto min-h-screen bg-slate-50 space-y-8">
            {/* --- Header --- */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">
                        Notification Preferences
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Manage how and when you receive alerts.
                    </p>
                </div>
                <Button
                    color="primary"
                    startContent={isSaving ? null : <Save size={18} />}
                    isLoading={isSaving}
                    onPress={handleSave}
                >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* --- LEFT COLUMN: General Settings --- */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Master Channels */}
                    <Card className="shadow-sm border border-slate-200">
                        <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
                            <h4 className="font-bold text-large">
                                Enable Channels
                            </h4>
                            <p className="text-tiny text-default-500">
                                Global master switches
                            </p>
                        </CardHeader>
                        <CardBody className="py-4 gap-4">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                        <Mail size={18} />
                                    </div>
                                    <span className="text-sm font-medium">
                                        Email Notifications
                                    </span>
                                </div>
                                <Switch
                                    isSelected={prefs.channels.email}
                                    onValueChange={(v) =>
                                        setPrefs({
                                            ...prefs,
                                            channels: {
                                                ...prefs.channels,
                                                email: v,
                                            },
                                        })
                                    }
                                />
                            </div>
                            <Divider />
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                        <Bell size={18} />
                                    </div>
                                    <span className="text-sm font-medium">
                                        Push / Browser
                                    </span>
                                </div>
                                <Switch
                                    isSelected={prefs.channels.browser}
                                    onValueChange={(v) =>
                                        setPrefs({
                                            ...prefs,
                                            channels: {
                                                ...prefs.channels,
                                                browser: v,
                                            },
                                        })
                                    }
                                />
                            </div>
                        </CardBody>
                    </Card>

                    {/* Do Not Disturb */}
                    <Card className="shadow-sm border border-slate-200">
                        <CardHeader className="pb-0 pt-4 px-4 flex justify-between items-start">
                            <div>
                                <h4 className="font-bold text-large">
                                    Quiet Hours
                                </h4>
                                <p className="text-tiny text-default-500">
                                    Pause notifications automatically
                                </p>
                            </div>
                            <Switch
                                size="sm"
                                isSelected={prefs.dnd.enabled}
                                onValueChange={(v) =>
                                    setPrefs({
                                        ...prefs,
                                        dnd: { ...prefs.dnd, enabled: v },
                                    })
                                }
                            />
                        </CardHeader>
                        <CardBody
                            className={`py-4 gap-4 ${!prefs.dnd.enabled ? 'opacity-50 pointer-events-none' : ''}`}
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <Select
                                    label="Start Time"
                                    size="sm"
                                    defaultSelectedKeys={[prefs.dnd.start]}
                                >
                                    <SelectItem key="21:00">
                                        09:00 PM
                                    </SelectItem>
                                    <SelectItem key="22:00">
                                        10:00 PM
                                    </SelectItem>
                                    <SelectItem key="23:00">
                                        11:00 PM
                                    </SelectItem>
                                </Select>
                                <Select
                                    label="End Time"
                                    size="sm"
                                    defaultSelectedKeys={[prefs.dnd.end]}
                                >
                                    <SelectItem key="07:00">
                                        07:00 AM
                                    </SelectItem>
                                    <SelectItem key="08:00">
                                        08:00 AM
                                    </SelectItem>
                                    <SelectItem key="09:00">
                                        09:00 AM
                                    </SelectItem>
                                </Select>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-100 p-2 rounded-lg">
                                <Moon size={14} />
                                <span>
                                    Based on:{' '}
                                    <strong>{prefs.dnd.timezone}</strong>
                                </span>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* --- RIGHT COLUMN: Granular Matrix --- */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Notification Matrix */}
                    <Card className="shadow-sm border border-slate-200">
                        <CardHeader className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                            <div className="flex-1">
                                <h4 className="font-bold text-lg text-slate-800">
                                    Trigger Rules
                                </h4>
                                <p className="text-sm text-slate-500">
                                    Fine-tune what you receive per channel.
                                </p>
                            </div>

                            {/* Column Headers */}
                            <div className="hidden md:flex gap-8 pr-4">
                                <div className="w-12 text-center text-xs font-bold text-slate-400 uppercase flex flex-col items-center gap-1">
                                    <Bell size={16} /> In-App
                                </div>
                                <div className="w-12 text-center text-xs font-bold text-slate-400 uppercase flex flex-col items-center gap-1">
                                    <Mail size={16} /> Email
                                </div>
                                <div className="w-12 text-center text-xs font-bold text-slate-400 uppercase flex flex-col items-center gap-1">
                                    <Smartphone size={16} /> Push
                                </div>
                            </div>
                        </CardHeader>

                        <CardBody className="p-0">
                            {prefs.triggers.map((trigger, idx) => (
                                <div
                                    key={trigger.id}
                                    className="flex flex-col md:flex-row items-center justify-between p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors"
                                >
                                    <div className="flex items-center gap-4 w-full md:w-auto mb-4 md:mb-0">
                                        <div
                                            className={`p-2.5 rounded-xl ${trigger.inApp ? 'bg-primary-50 text-primary' : 'bg-slate-100 text-slate-400'}`}
                                        >
                                            <trigger.icon size={20} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-700">
                                                {trigger.label}
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                {trigger.desc}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-8 pr-2">
                                        <Tooltip content="Toggle In-App">
                                            <Switch
                                                size="sm"
                                                isSelected={trigger.inApp}
                                                onValueChange={() =>
                                                    toggleTrigger(idx, 'inApp')
                                                }
                                            />
                                        </Tooltip>
                                        <Tooltip content="Toggle Email">
                                            <Switch
                                                size="sm"
                                                isSelected={trigger.email}
                                                onValueChange={() =>
                                                    toggleTrigger(idx, 'email')
                                                }
                                                color="warning"
                                            />
                                        </Tooltip>
                                        <Tooltip content="Toggle Mobile Push">
                                            <Switch
                                                size="sm"
                                                isSelected={trigger.push}
                                                onValueChange={() =>
                                                    toggleTrigger(idx, 'push')
                                                }
                                                color="success"
                                            />
                                        </Tooltip>
                                    </div>
                                </div>
                            ))}
                        </CardBody>
                    </Card>

                    {/* Active Devices */}
                    <Card className="shadow-sm border border-slate-200">
                        <CardHeader className="px-6 pt-6 pb-2">
                            <h4 className="font-bold text-lg text-slate-800">
                                Active Devices
                            </h4>
                        </CardHeader>
                        <CardBody className="px-6 pb-6">
                            <div className="space-y-4">
                                {DEVICES.map((device) => (
                                    <div
                                        key={device.id}
                                        className="flex items-center justify-between p-3 border border-slate-200 rounded-xl"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                                                <device.icon size={20} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-bold text-sm text-slate-700">
                                                        {device.name}
                                                    </p>
                                                    {device.current && (
                                                        <Chip
                                                            size="sm"
                                                            color="success"
                                                            variant="flat"
                                                            className="h-5 text-[10px]"
                                                        >
                                                            This Device
                                                        </Chip>
                                                    )}
                                                </div>
                                                <p className="text-xs text-slate-400">
                                                    Last active:{' '}
                                                    {device.lastActive}
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            isIconOnly
                                            size="sm"
                                            variant="light"
                                            color="danger"
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    )
}
