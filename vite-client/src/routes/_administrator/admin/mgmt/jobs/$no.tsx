import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_administrator/admin/mgmt/jobs/$no')({
  component: JobEditPage,
})

import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Textarea,
  Button,
  Select,
  SelectItem,
  Tabs,
  Tab,
  Chip,
  Avatar,
  AvatarGroup,
  Divider,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Switch,
  Breadcrumbs,
  BreadcrumbItem,
  Tooltip,
} from "@heroui/react";
import {
  Save,
  ArrowLeft,
  MoreVertical,
  Calendar,
  DollarSign,
  Users,
  FileText,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  Printer,
  Copy,
  Trash2,
  ExternalLink,
  CreditCard,
  Briefcase,
  Paperclip,
  Clock,
  Send,
  Download,
} from "lucide-react";

// --- Mock Data (Simulating a fetched Job) ---
const JOB_DATA = {
  id: "1",
  no: "FV-2024",
  title: "E-Commerce Website Redesign",
  description: "Complete overhaul of the main storefront. Includes new cart logic, payment gateway integration (Stripe), and mobile responsiveness improvements.",
  clientName: "TechCorp Industries",
  status: "IN_PROGRESS",
  priority: "HIGH",
  type: "Web Development",
  incomeCost: 4500.00,
  staffCost: 1200.00,
  isPaid: false,
  isPublished: true,
  createdAt: "2024-02-01",
  dueAt: "2024-03-15",
  assignees: [
    { id: "u1", name: "Sarah Wilson", role: "Lead Dev", avatar: "https://i.pravatar.cc/150?u=sarah" },
    { id: "u2", name: "David Chen", role: "Designer", avatar: "https://i.pravatar.cc/150?u=david" },
  ],
  files: [
    { name: "Requirements_v2.pdf", size: "2.4 MB", date: "Feb 02, 2024" },
    { name: "Design_Mockups.fig", size: "12 MB", date: "Feb 05, 2024" },
  ],
  activity: [
    { user: "Sarah Wilson", action: "changed status to", target: "In Progress", time: "2 days ago" },
    { user: "Admin", action: "created job", target: "FV-2024", time: "1 week ago" },
  ],
};

// --- Constants ---
const STATUS_OPTIONS = [
  { key: "TODO", label: "To Do", color: "default" },
  { key: "IN_PROGRESS", label: "In Progress", color: "primary" },
  { key: "REVIEW", label: "Review", color: "warning" },
  { key: "DONE", label: "Done", color: "success" },
  { key: "CANCELLED", label: "Cancelled", color: "danger" },
];

const PRIORITY_OPTIONS = [
  { key: "LOW", label: "Low" },
  { key: "MEDIUM", label: "Medium" },
  { key: "HIGH", label: "High" },
  { key: "URGENT", label: "Urgent" },
];

function JobEditPage() {
  const [formData, setFormData] = useState(JOB_DATA);
  const [activeTab, setActiveTab] = useState("details");

  const handleStatusChange = (keys: any) => {
    const selected = Array.from(keys)[0] as string;
    setFormData({ ...formData, status: selected });
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto min-h-screen bg-slate-50 font-sans">
      
      {/* --- TOP NAVIGATION & BREADCRUMBS --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Button isIconOnly variant="light" className="text-slate-400 hover:text-slate-700">
            <ArrowLeft size={20} />
          </Button>
          <div>
            <Breadcrumbs size="sm" className="mb-1">
              <BreadcrumbItem>Dashboard</BreadcrumbItem>
              <BreadcrumbItem>Jobs</BreadcrumbItem>
              <BreadcrumbItem isCurrent>{formData.no}</BreadcrumbItem>
            </Breadcrumbs>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">{formData.title}</h1>
              <Chip size="sm" variant="dot" color={formData.status === 'IN_PROGRESS' ? 'primary' : 'default'}>
                {formData.status.replace("_", " ")}
              </Chip>
            </div>
          </div>
        </div>

        {/* --- QUICK ACTION TOOLBAR --- */}
        <div className="flex flex-wrap items-center gap-2">
            <Tooltip content="View Public Page">
                <Button isIconOnly variant="flat" size="sm">
                    <ExternalLink size={18} className="text-slate-500" />
                </Button>
            </Tooltip>
            
            <Dropdown>
                <DropdownTrigger>
                    <Button variant="flat" color="primary" endContent={<MoreVertical size={16} />}>
                        Actions
                    </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Quick Actions">
                    <DropdownItem key="invoice" startContent={<FileText size={16} />}>Generate Invoice</DropdownItem>
                    <DropdownItem key="duplicate" startContent={<Copy size={16} />}>Duplicate Job</DropdownItem>
                    <DropdownItem key="print" startContent={<Printer size={16} />}>Print Job Sheet</DropdownItem>
                    <DropdownItem key="delete" className="text-danger" color="danger" startContent={<Trash2 size={16} />}>
                        Delete Job
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>

            <Button color="primary" startContent={<Save size={18} />}>
                Save Changes
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* --- LEFT COLUMN: MAIN CONTENT --- */}
        <div className="xl:col-span-2 space-y-6">
            
            {/* Status & Progress Bar */}
            <Card className="w-full shadow-sm border border-slate-200">
                <CardBody className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex flex-col">
                             <span className="text-xs font-bold text-slate-400 uppercase">Current Stage</span>
                             <span className="font-bold text-lg text-primary">{formData.status.replace("_", " ")}</span>
                        </div>
                        <div className="flex gap-2">
                            {STATUS_OPTIONS.map((opt) => (
                                <Button 
                                    key={opt.key}
                                    size="sm" 
                                    variant={formData.status === opt.key ? "solid" : "bordered"}
                                    color={formData.status === opt.key ? (opt.color as any) : "default"}
                                    onPress={() => setFormData({...formData, status: opt.key})}
                                    className="min-w-0 px-3"
                                >
                                    {opt.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                    {/* Visual Progress Mock */}
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
                        <div className="bg-emerald-500 w-[25%] h-full opacity-50"></div>
                        <div className="bg-primary w-[25%] h-full"></div>
                        <div className="bg-slate-200 w-[50%] h-full"></div>
                    </div>
                </CardBody>
            </Card>

            {/* Main Tabs Form */}
            <Card className="w-full shadow-sm border border-slate-200 min-h-[600px]">
                <CardHeader className="p-0 border-b border-border-default">
                    <Tabs 
                        aria-label="Job Edit Sections" 
                        variant="underlined"
                        color="primary"
                        classNames={{
                            tabList: "p-4 gap-6",
                            cursor: "w-full bg-primary",
                            tab: "max-w-fit px-0 h-10",
                            tabContent: "group-data-[selected=true]:text-primary font-semibold text-slate-500"
                        }}
                        selectedKey={activeTab}
                        onSelectionChange={(k) => setActiveTab(k as string)}
                    >
                        <Tab key="details" title={<div className="flex items-center gap-2"><Briefcase size={16}/> Details</div>} />
                        <Tab key="financials" title={<div className="flex items-center gap-2"><DollarSign size={16}/> Financials</div>} />
                        <Tab key="team" title={<div className="flex items-center gap-2"><Users size={16}/> Team & Files</div>} />
                        <Tab key="activity" title={<div className="flex items-center gap-2"><MessageSquare size={16}/> Activity</div>} />
                    </Tabs>
                </CardHeader>
                
                <CardBody className="p-6">
                    {/* --- TAB: DETAILS --- */}
                    {activeTab === 'details' && (
                        <div className="space-y-6 animate-in fade-in">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <Input 
                                        label="Job Title" 
                                        labelPlacement="outside" 
                                        placeholder="e.g. Website Redesign" 
                                        defaultValue={formData.title} 
                                        variant="bordered"
                                    />
                                </div>
                                <div>
                                    <Input 
                                        label="Client Name" 
                                        labelPlacement="outside" 
                                        placeholder="Client Company" 
                                        defaultValue={formData.clientName} 
                                        variant="bordered"
                                        startContent={<Briefcase size={16} className="text-slate-400" />}
                                    />
                                </div>
                                <div>
                                    <Select 
                                        label="Priority" 
                                        labelPlacement="outside" 
                                        placeholder="Select Priority" 
                                        defaultSelectedKeys={[formData.priority]}
                                        variant="bordered"
                                    >
                                        {PRIORITY_OPTIONS.map((p) => <SelectItem key={p.key} value={p.key}>{p.label}</SelectItem>)}
                                    </Select>
                                </div>
                                <div>
                                    <Input 
                                        type="date" 
                                        label="Start Date" 
                                        labelPlacement="outside" 
                                        defaultValue={formData.createdAt} 
                                        variant="bordered" 
                                    />
                                </div>
                                <div>
                                    <Input 
                                        type="date" 
                                        label="Due Date" 
                                        labelPlacement="outside" 
                                        defaultValue={formData.dueAt} 
                                        variant="bordered"
                                        color={new Date(formData.dueAt) < new Date() ? "danger" : "default"}
                                        description={new Date(formData.dueAt) < new Date() ? "This job is overdue!" : ""}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <Textarea 
                                        label="Description / Scope of Work" 
                                        labelPlacement="outside" 
                                        placeholder="Describe the job details..." 
                                        minRows={6}
                                        defaultValue={formData.description}
                                        variant="bordered"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- TAB: FINANCIALS --- */}
                    {activeTab === 'financials' && (
                         <div className="space-y-6 animate-in fade-in">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card className="bg-emerald-50 border border-emerald-100 shadow-none">
                                    <CardBody className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <label className="text-xs font-bold text-emerald-700 uppercase">Total Income</label>
                                            <DollarSign size={16} className="text-emerald-600" />
                                        </div>
                                        <Input 
                                            size="lg"
                                            placeholder="0.00"
                                            startContent={<span className="text-emerald-700 font-bold">$</span>}
                                            defaultValue={String(formData.incomeCost)}
                                            classNames={{ inputWrapper: "bg-white", input: "font-bold text-emerald-700" }}
                                        />
                                        <p className="text-xs text-emerald-600 mt-2">Amount billable to client</p>
                                    </CardBody>
                                </Card>

                                <Card className="bg-orange-50 border border-orange-100 shadow-none">
                                    <CardBody className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <label className="text-xs font-bold text-orange-700 uppercase">Staff Cost (COGS)</label>
                                            <Users size={16} className="text-orange-600" />
                                        </div>
                                        <Input 
                                            size="lg"
                                            placeholder="0.00"
                                            startContent={<span className="text-orange-700 font-bold">$</span>}
                                            defaultValue={String(formData.staffCost)}
                                            classNames={{ inputWrapper: "bg-white", input: "font-bold text-orange-700" }}
                                        />
                                        <p className="text-xs text-orange-600 mt-2">Total payout to assignees</p>
                                    </CardBody>
                                </Card>
                            </div>

                            <Divider />

                            <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                                <div>
                                    <h4 className="font-bold text-slate-800">Payment Status</h4>
                                    <p className="text-sm text-slate-500">Has the client paid for this job?</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`text-sm font-bold ${formData.isPaid ? "text-emerald-600" : "text-slate-400"}`}>
                                        {formData.isPaid ? "PAID" : "UNPAID"}
                                    </span>
                                    <Switch defaultSelected={formData.isPaid} color="success" />
                                </div>
                            </div>

                             <div className="flex justify-end pt-4">
                                <Button color="primary" variant="flat" startContent={<FileText size={16} />}>
                                    Create/View Invoice
                                </Button>
                             </div>
                        </div>
                    )}

                    {/* --- TAB: TEAM & FILES --- */}
                    {activeTab === 'team' && (
                        <div className="space-y-8 animate-in fade-in">
                            {/* Team Section */}
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                        <Users size={18} /> Assigned Members
                                    </h3>
                                    <Button size="sm" variant="light" color="primary" startContent={<Users size={14} />}>
                                        Manage Access
                                    </Button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {formData.assignees.map(user => (
                                        <div key={user.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-xl hover:border-primary transition-colors cursor-pointer group">
                                            <div className="flex items-center gap-3">
                                                <Avatar src={user.avatar} />
                                                <div>
                                                    <p className="font-bold text-sm text-slate-700">{user.name}</p>
                                                    <p className="text-xs text-slate-400">{user.role}</p>
                                                </div>
                                            </div>
                                            <Button isIconOnly size="sm" variant="light" color="danger" className="opacity-0 group-hover:opacity-100">
                                                <Trash2 size={14} />
                                            </Button>
                                        </div>
                                    ))}
                                    <button className="border border-dashed border-slate-300 rounded-xl flex items-center justify-center gap-2 h-[66px] text-slate-400 hover:text-primary hover:border-primary hover:bg-primary-50 transition-all">
                                        <Users size={18} /> Add Member
                                    </button>
                                </div>
                            </div>

                            <Divider />

                            {/* Files Section */}
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                        <Paperclip size={18} /> Attachments
                                    </h3>
                                    <Button size="sm" variant="light" color="primary">Upload New</Button>
                                </div>
                                <div className="space-y-2">
                                    {formData.files.map((file, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white rounded-md border border-slate-200 text-red-500">
                                                    <FileText size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-700 hover:text-primary hover:underline cursor-pointer">{file.name}</p>
                                                    <p className="text-xs text-slate-400">{file.size} • {file.date}</p>
                                                </div>
                                            </div>
                                            <Button isIconOnly size="sm" variant="light"><Download size={16} /></Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    
                     {/* --- TAB: ACTIVITY --- */}
                     {activeTab === 'activity' && (
                        <div className="space-y-4 animate-in fade-in">
                            <div className="flex gap-4">
                                <Avatar src="https://i.pravatar.cc/150?u=admin" className="w-10 h-10" />
                                <div className="flex-1">
                                    <Textarea 
                                        placeholder="Add a comment or note..." 
                                        minRows={2} 
                                        variant="faded" 
                                        className="mb-2"
                                    />
                                    <Button size="sm" color="primary" startContent={<Send size={14} />}>Post Comment</Button>
                                </div>
                            </div>
                            
                            <Divider className="my-4" />

                            <div className="space-y-6">
                                {formData.activity.map((log, idx) => (
                                    <div key={idx} className="flex gap-4 relative">
                                        {/* Timeline line */}
                                        {idx !== formData.activity.length - 1 && (
                                            <div className="absolute left-[19px] top-10 bottom-[-24px] w-[2px] bg-slate-100"></div>
                                        )}
                                        <Avatar name={log.user[0]} className="w-10 h-10 text-xs shrink-0" />
                                        <div>
                                            <p className="text-sm text-slate-800">
                                                <span className="font-bold">{log.user}</span> {log.action} <span className="font-bold">{log.target}</span>
                                            </p>
                                            <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                                                <Clock size={10} /> {log.time}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                     )}

                </CardBody>
            </Card>
        </div>

        {/* --- RIGHT COLUMN: SIDEBAR --- */}
        <div className="space-y-6">
            
            {/* Meta Info Card */}
            <Card className="w-full shadow-sm border border-slate-200">
                <CardHeader className="bg-slate-50 border-b border-border-default px-4 py-3">
                    <h3 className="text-sm font-bold text-slate-700">Job Information</h3>
                </CardHeader>
                <CardBody className="p-4 space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-500">Job No.</span>
                        <span className="text-sm font-mono font-bold bg-slate-100 px-2 py-0.5 rounded">{formData.no}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-500">Created</span>
                        <span className="text-sm font-semibold">{formData.createdAt}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-500">Job Type</span>
                        <Chip size="sm" variant="flat">{formData.type}</Chip>
                    </div>
                    <Divider />
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-500">Published</span>
                        <Switch size="sm" defaultSelected={formData.isPublished} />
                    </div>
                </CardBody>
            </Card>

            {/* Quick Assign Card */}
            <Card className="w-full shadow-sm border border-slate-200 bg-blue-50">
                <CardBody className="p-4">
                    <h4 className="font-bold text-blue-900 mb-2 text-sm">Need help?</h4>
                    <p className="text-xs text-blue-700 mb-3">Assign more team members to speed up this job.</p>
                    <AvatarGroup isBordered max={4} size="sm" className="justify-start mb-3">
                        <Avatar src="https://i.pravatar.cc/150?u=a" />
                        <Avatar src="https://i.pravatar.cc/150?u=b" />
                        <Avatar src="https://i.pravatar.cc/150?u=c" />
                    </AvatarGroup>
                    <Button size="sm" variant="solid" color="primary" className="w-full bg-blue-600">Assign Members</Button>
                </CardBody>
            </Card>

            {/* Danger Zone */}
             <Card className="w-full shadow-none border border-red-200">
                <CardBody className="p-4">
                    <h4 className="font-bold text-red-900 mb-2 text-sm">Danger Zone</h4>
                    <Button size="sm" variant="light" color="danger" className="w-full justify-start" startContent={<Trash2 size={16} />}>
                        Delete this Job
                    </Button>
                </CardBody>
            </Card>
        </div>

      </div>
    </div>
  );
};