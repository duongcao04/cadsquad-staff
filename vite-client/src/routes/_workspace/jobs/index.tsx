import React, { useState } from 'react'
import {
    Card,
    CardBody,
    CardHeader,
    Button,
    Chip,
    Progress,
    Avatar,
    AvatarGroup,
    Tabs,
    Tab,
    Textarea,
    Divider,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Snippet,
    Tooltip,
} from '@heroui/react'
import {
    Play,
    Pause,
    CheckCircle2,
    UploadCloud,
    MessageSquare,
    Clock,
    FileText,
    AlertTriangle,
    MoreVertical,
    Flag,
    Share2,
    Paperclip,
    Download,
    Calendar,
    Briefcase,
    ChevronRight,
    Send,
} from 'lucide-react'
import { JobActionToolbar } from '../../../shared/components/job-detail/JobActionToolbar'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_workspace/jobs/')({
    component: UserJobDetailPage,
})
// --- Mock Data ---
const JOB_DATA = {
    id: '1',
    no: 'FV-2024',
    title: 'E-Commerce Website Redesign',
    client: 'TechCorp Industries',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    dueDate: '2024-03-15',
    description:
        'Complete overhaul of the main storefront. Requires implementation of the new Figma design tokens and Stripe payment gateway integration.',
    progress: 65,
    assignees: [
        { name: 'You', avatar: 'https://i.pravatar.cc/150?u=me' },
        { name: 'David', avatar: 'https://i.pravatar.cc/150?u=david' },
    ],
    files: [
        { name: 'Design_Specs_v2.pdf', size: '4.2 MB', date: 'Feb 10, 2024' },
        { name: 'Assets_Bundle.zip', size: '128 MB', date: 'Feb 12, 2024' },
    ],
}
function UserJobDetailPage() {
    const [activeTab, setActiveTab] = useState('overview')

    // --- COMPONENT: Job Action Toolbar ---
    // This is the "List of Buttons" specific for the user's workflow

    return (
        <div className="p-6 max-w-[1200px] mx-auto min-h-screen bg-slate-50 font-sans space-y-6">
            {/* --- Breadcrumbs & Header --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                        <span>My Jobs</span>
                        <ChevronRight size={12} />
                        <span className="text-slate-600 font-bold">
                            {JOB_DATA.no}
                        </span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        {JOB_DATA.title}
                    </h1>
                    <p className="text-slate-500 text-sm flex items-center gap-2 mt-1">
                        <Briefcase size={14} /> {JOB_DATA.client}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end mr-4">
                        <span className="text-xs text-slate-400 uppercase font-bold">
                            Due Date
                        </span>
                        <span className="text-sm font-bold text-slate-700 flex items-center gap-1">
                            <Calendar size={14} /> {JOB_DATA.dueDate}
                        </span>
                    </div>
                    <Chip
                        color="primary"
                        variant="shadow"
                        size="lg"
                        classNames={{ base: 'px-4' }}
                    >
                        {JOB_DATA.status.replace('_', ' ')}
                    </Chip>

                    <Dropdown>
                        <DropdownTrigger>
                            <Button isIconOnly variant="flat">
                                <MoreVertical size={20} />
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="More Actions">
                            <DropdownItem
                                key="share"
                                startContent={<Share2 size={16} />}
                            >
                                Share Job
                            </DropdownItem>
                            <DropdownItem
                                key="link"
                                startContent={<Paperclip size={16} />}
                            >
                                Copy Link
                            </DropdownItem>
                            <DropdownItem
                                key="leave"
                                className="text-danger"
                                color="danger"
                                startContent={<Flag size={16} />}
                            >
                                Leave Job
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </div>

            <Divider />

            {/* --- QUICK ACTION TOOLBAR --- */}
            <JobActionToolbar />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* --- LEFT: MAIN CONTENT --- */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="w-full shadow-sm border border-slate-200 min-h-[500px]">
                        <CardHeader className="p-0 border-b border-slate-100">
                            <Tabs
                                aria-label="Job Tabs"
                                variant="underlined"
                                color="primary"
                                classNames={{
                                    tabList: 'p-4 gap-6',
                                    cursor: 'w-full bg-primary',
                                    tab: 'max-w-fit px-0 h-10',
                                    tabContent:
                                        'group-data-[selected=true]:text-primary font-semibold text-slate-500',
                                }}
                                selectedKey={activeTab}
                                onSelectionChange={(k) =>
                                    setActiveTab(k as string)
                                }
                            >
                                <Tab key="overview" title="Overview" />
                                <Tab key="files" title="Files & Assets" />
                                <Tab key="discussion" title="Discussion" />
                            </Tabs>
                        </CardHeader>
                        <CardBody className="p-6">
                            {/* TAB: OVERVIEW */}
                            {activeTab === 'overview' && (
                                <div className="space-y-6 animate-in fade-in">
                                    <div>
                                        <h3 className="font-bold text-slate-800 mb-2">
                                            Description
                                        </h3>
                                        <p className="text-slate-600 leading-relaxed text-sm">
                                            {JOB_DATA.description}
                                        </p>
                                    </div>

                                    <Divider />

                                    <div>
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="font-bold text-slate-800">
                                                Your Progress
                                            </h3>
                                            <span className="text-primary font-bold">
                                                {JOB_DATA.progress}%
                                            </span>
                                        </div>
                                        <Progress
                                            value={JOB_DATA.progress}
                                            color="primary"
                                            className="mb-2"
                                        />
                                        <p className="text-xs text-slate-400">
                                            Update your progress manually if
                                            automatic tracking is disabled.
                                        </p>

                                        <div className="flex gap-2 mt-4">
                                            <Button
                                                size="sm"
                                                variant="flat"
                                                onPress={() =>
                                                    alert('Updated to 25%')
                                                }
                                            >
                                                25%
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="flat"
                                                onPress={() =>
                                                    alert('Updated to 50%')
                                                }
                                            >
                                                50%
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="flat"
                                                onPress={() =>
                                                    alert('Updated to 75%')
                                                }
                                            >
                                                75%
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="flat"
                                                color="success"
                                                onPress={() =>
                                                    alert('Updated to 100%')
                                                }
                                            >
                                                100%
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB: FILES */}
                            {activeTab === 'files' && (
                                <div className="space-y-4 animate-in fade-in">
                                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-primary transition-colors cursor-pointer">
                                        <UploadCloud
                                            size={32}
                                            className="mb-2 text-slate-400"
                                        />
                                        <span className="font-semibold">
                                            Drag & Drop files here
                                        </span>
                                        <span className="text-xs">
                                            or click to browse
                                        </span>
                                    </div>

                                    <h4 className="font-bold text-sm text-slate-700 mt-6">
                                        Attached Files
                                    </h4>
                                    {JOB_DATA.files.map((file, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center justify-between p-3 border border-slate-200 rounded-xl bg-slate-50"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white border border-slate-200 rounded-lg text-red-500">
                                                    <FileText size={18} />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-sm text-slate-700">
                                                        {file.name}
                                                    </p>
                                                    <p className="text-xs text-slate-400">
                                                        {file.size} •{' '}
                                                        {file.date}
                                                    </p>
                                                </div>
                                            </div>
                                            <Button
                                                isIconOnly
                                                size="sm"
                                                variant="light"
                                            >
                                                <Download size={16} />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* TAB: DISCUSSION */}
                            {activeTab === 'discussion' && (
                                <div className="flex flex-col h-[400px]">
                                    <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                                        {/* Message 1 */}
                                        <div className="flex gap-3">
                                            <Avatar
                                                src="https://i.pravatar.cc/150?u=david"
                                                size="sm"
                                            />
                                            <div className="bg-slate-100 p-3 rounded-xl rounded-tl-none">
                                                <p className="text-xs font-bold text-slate-700 mb-1">
                                                    David Chen
                                                </p>
                                                <p className="text-sm text-slate-600">
                                                    Please check the new assets
                                                    I uploaded. They match the
                                                    Figma file.
                                                </p>
                                                <span className="text-[10px] text-slate-400 mt-1 block">
                                                    2 hours ago
                                                </span>
                                            </div>
                                        </div>
                                        {/* Message 2 (Me) */}
                                        <div className="flex gap-3 flex-row-reverse">
                                            <Avatar
                                                src="https://i.pravatar.cc/150?u=me"
                                                size="sm"
                                            />
                                            <div className="bg-primary-50 p-3 rounded-xl rounded-tr-none">
                                                <p className="text-xs font-bold text-primary mb-1 text-right">
                                                    You
                                                </p>
                                                <p className="text-sm text-slate-700">
                                                    Got it. I will start
                                                    implementing the checkout
                                                    flow now.
                                                </p>
                                                <span className="text-[10px] text-primary/60 mt-1 block text-right">
                                                    Just now
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-slate-100">
                                        <Textarea
                                            placeholder="Type your message..."
                                            minRows={2}
                                            variant="bordered"
                                            className="mb-2"
                                        />
                                        <div className="flex justify-between items-center">
                                            <Button
                                                isIconOnly
                                                size="sm"
                                                variant="light"
                                            >
                                                <Paperclip size={16} />
                                            </Button>
                                            <Button
                                                size="sm"
                                                color="primary"
                                                endContent={<Send size={14} />}
                                            >
                                                Send
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardBody>
                    </Card>
                </div>

                {/* --- RIGHT: SIDEBAR INFO --- */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Team Members */}
                    <Card className="shadow-sm border border-slate-200">
                        <CardHeader className="px-4 py-3 bg-slate-50 border-b border-slate-100">
                            <h4 className="font-bold text-slate-700 text-sm">
                                Team Members
                            </h4>
                        </CardHeader>
                        <CardBody className="p-4">
                            <div className="space-y-3">
                                {JOB_DATA.assignees.map((user, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-3"
                                    >
                                        <Avatar src={user.avatar} size="sm" />
                                        <div>
                                            <p className="font-bold text-sm text-slate-700">
                                                {user.name}
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                Assignee
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardBody>
                    </Card>

                    {/* Git Integration (Optional visual) */}
                    <Card className="shadow-sm border border-slate-200 bg-slate-900 text-white">
                        <CardBody className="p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="p-1 bg-white/10 rounded">
                                    <FileText size={16} />
                                </div>
                                <span className="font-bold text-sm">
                                    Branch Info
                                </span>
                            </div>
                            <Snippet
                                symbol=""
                                size="sm"
                                className="bg-black/30 text-slate-300 w-full mb-2"
                            >
                                git checkout feature/fv-2024
                            </Snippet>
                            <p className="text-[10px] text-slate-400">
                                Use this branch for all commits related to this
                                job.
                            </p>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    )
}
