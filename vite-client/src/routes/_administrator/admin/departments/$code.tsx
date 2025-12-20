import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_administrator/admin/departments/$code')({
  component: DepartmentPage,
})

import React, { useState } from "react";
import {
  Card,
  CardBody,
  Button,
  Avatar,
  AvatarGroup,
  Tabs,
  Tab,
  Progress,
  Chip,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
} from "@heroui/react";
import {
  Briefcase,
  Users,
  DollarSign,
  Calendar,
  MoreHorizontal,
  Plus,
  Clock,
  CheckCircle2,
} from "lucide-react";

// --- Mock Data (Replace with API calls) ---
const DEPT_INFO = {
  id: "d1",
  displayName: "Design Team",
  hexColor: "#8B5CF6", // Violet
  manager: { name: "Sarah Wilson", avatar: "https://i.pravatar.cc/150?u=sarah" },
  description: "Responsible for UI/UX, branding, and graphic design assets.",
  stats: {
    members: 8,
    activeJobs: 12,
    revenueThisMonth: 15400,
    capacity: 75, // 75% busy
  },
};

const MEMBERS = [
  { id: 1, name: "Sarah Wilson", role: "Manager", status: "Busy", avatar: "https://i.pravatar.cc/150?u=sarah" },
  { id: 2, name: "John Doe", role: "Senior Designer", status: "Available", avatar: "https://i.pravatar.cc/150?u=john" },
  { id: 3, name: "Jane Smith", role: "UI Designer", status: "On Leave", avatar: "https://i.pravatar.cc/150?u=jane" },
];

const TEAM_JOBS = [
  { id: 101, title: "Website Redesign", client: "TechCorp", due: "2 Days", status: "In Progress", progress: 60 },
  { id: 102, title: "Mobile App Assets", client: "Startup Inc", due: "Today", status: "Urgent", progress: 90 },
  { id: 103, title: "Branding Kit", client: "Coffee Shop", due: "1 Week", status: "Pending", progress: 0 },
];

// --- Sub-Component: Stat Card ---
const StatCard = ({ icon: Icon, label, value, color }: any) => (
  <Card shadow="sm" className="w-full">
    <CardBody className="flex items-center gap-4 p-4">
      <div className={`p-3 rounded-xl ${color} bg-opacity-20`}>
        <Icon size={24} className={color.replace("bg-", "text-")} />
      </div>
      <div>
        <p className="text-small text-default-500">{label}</p>
        <h4 className="text-xl font-bold text-default-900">{value}</h4>
      </div>
    </CardBody>
  </Card>
);

function DepartmentPage() {
  const [selectedTab, setSelectedTab] = useState<string>("overview");

  return (
    <div className="p-8 max-w-[1600px] mx-auto min-h-screen bg-slate-50 space-y-8">
      
      {/* --- Header --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          {/* Department Icon/Logo */}
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg"
            style={{ backgroundColor: DEPT_INFO.hexColor }}
          >
            {DEPT_INFO.displayName.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{DEPT_INFO.displayName}</h1>
            <p className="text-slate-500 text-sm mt-1 max-w-md line-clamp-1">
              {DEPT_INFO.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
            <div className="text-right mr-4 hidden md:block">
                <p className="text-xs text-slate-400 font-bold uppercase">Team Lead</p>
                <p className="text-sm font-semibold text-slate-700">{DEPT_INFO.manager.name}</p>
            </div>
            <Avatar src={DEPT_INFO.manager.avatar} isBordered color="primary" />
            <Button color="primary" className="ml-4 font-semibold" endContent={<Plus size={16} />}>
                Assign Job
            </Button>
        </div>
      </div>

      {/* --- Main Content Tabs --- */}
      <Tabs 
        aria-label="Department Sections" 
        color="primary" 
        variant="underlined"
        classNames={{
            tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
            cursor: "w-full bg-primary",
            tab: "max-w-fit px-0 h-12",
            tabContent: "group-data-[selected=true]:text-primary font-medium"
        }}
        selectedKey={selectedTab}
        onSelectionChange={(key) => setSelectedTab(key.toString())}
      >
        
        {/* === TAB 1: OVERVIEW === */}
        <Tab key="overview" title="Overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                <StatCard icon={Users} label="Total Members" value={DEPT_INFO.stats.members} color="bg-blue-500 text-blue-500" />
                <StatCard icon={Briefcase} label="Active Jobs" value={DEPT_INFO.stats.activeJobs} color="bg-purple-500 text-purple-500" />
                <StatCard icon={DollarSign} label="Monthly Revenue" value={"$${DEPT_INFO.stats.revenueThisMonth.toLocaleString()}"} color="bg-emerald-500 text-emerald-500" />
                
                {/* Capacity Card */}
                <Card shadow="sm" className="w-full">
                    <CardBody className="p-4">
                        <div className="flex justify-between mb-2">
                            <span className="text-small text-default-500">Team Capacity</span>
                            <span className="text-small font-bold">{DEPT_INFO.stats.capacity}%</span>
                        </div>
                        <Progress 
                            value={DEPT_INFO.stats.capacity} 
                            color={DEPT_INFO.stats.capacity > 80 ? "danger" : "success"} 
                            className="max-w-md"
                        />
                         <p className="text-[10px] text-default-400 mt-2">High load. Consider delaying new tasks.</p>
                    </CardBody>
                </Card>
            </div>

            {/* Recent Activity / Jobs */}
            <div className="mt-8">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Active Projects</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {TEAM_JOBS.map((job) => (
                        <Card key={job.id} shadow="sm" className="hover:shadow-md transition-shadow cursor-pointer">
                            <CardBody className="p-5">
                                <div className="flex justify-between items-start mb-4">
                                    <Chip size="sm" variant="flat" color={job.status === "Urgent" ? "danger" : "primary"}>{job.status}</Chip>
                                    <Button isIconOnly size="sm" variant="light"><MoreHorizontal size={16} /></Button>
                                </div>
                                <h4 className="text-lg font-bold text-slate-800">{job.title}</h4>
                                <p className="text-sm text-slate-500 mb-4">{job.client}</p>
                                
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-slate-400">Progress</span>
                                        <span className="font-bold text-slate-700">{job.progress}%</span>
                                    </div>
                                    <Progress size="sm" value={job.progress} color="primary" />
                                </div>
                                
                                <div className="flex items-center gap-2 mt-4 text-xs text-slate-500 font-medium bg-slate-50 p-2 rounded-lg">
                                    <Clock size={14} /> Due: {job.due}
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </div>
        </Tab>

        {/* === TAB 2: MEMBERS === */}
        <Tab key="members" title="Members">
            <Card className="mt-6">
                <CardBody>
                    <Table aria-label="Department Members" shadow="none" removeWrapper>
                        <TableHeader>
                            <TableColumn>MEMBER</TableColumn>
                            <TableColumn>ROLE</TableColumn>
                            <TableColumn>STATUS</TableColumn>
                            <TableColumn>ACTIONS</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {MEMBERS.map((member) => (
                                <TableRow key={member.id}>
                                    <TableCell>
                                        <User 
                                            name={member.name} 
                                            description={member.role} 
                                            avatarProps={{src: member.avatar, radius: "lg"}} 
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-slate-500 text-sm">{member.role}</span>
                                    </TableCell>
                                    <TableCell>
                                        <Chip 
                                            size="sm" 
                                            variant="dot" 
                                            color={member.status === 'Available' ? 'success' : member.status === 'Busy' ? 'warning' : 'default'}
                                        >
                                            {member.status}
                                        </Chip>
                                    </TableCell>
                                    <TableCell>
                                        <Button size="sm" variant="light">Details</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardBody>
            </Card>
        </Tab>

        {/* === TAB 3: SCHEDULE === */}
        <Tab key="schedule" title="Schedule">
             <div className="mt-6 flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-dashed border-slate-300">
                <Calendar size={48} className="text-slate-300 mb-4" />
                <h3 className="text-lg font-bold text-slate-700">Team Calendar</h3>
                <p className="text-slate-400 text-sm">View deadlines and time-off requests for the {DEPT_INFO.displayName}.</p>
                <Button variant="flat" className="mt-4">View Full Calendar</Button>
             </div>
        </Tab>

      </Tabs>
    </div>
  );
};